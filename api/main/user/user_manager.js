'use strict';

// Dependencies
const User			= require( './user' );
const DataServer	= require( 'event_request/server/components/caching/data_server' );
const path			= require( 'path' );

const USER_KEY		= 'USERS_DATA';
const persistPath	= path.parse( require.main.filename ).dir;
const PERSIST_TIME	= 15000;

/**
 * @brief	Class responsible for user CRUD operations
 */
class UserManager
{
	constructor()
	{
		this.dataStore			= new DataServer({
			ttl				: -1,
			persist			: true,
			persistPath		: path.join( persistPath, 'server_emulator_users.json' ),
			persistInterval	: 30,	// Every 30 seconds
			gcInterval		: 86400	// One day
		});
		this.users				= null;

		this.fetchUsers();

		this.flushUserInterval	= setInterval(() => {
			this.flushUsers();
		}, PERSIST_TIME );
	}

	/**
	 * @brief	Handle any errors from the dataStore
	 *
	 * @details	setImmediate is called because we don't want to throw in a catch block of a promise
	 *
	 * @param	{Error} err
	 *
	 * @return	void
	 */
	catchError( err )
	{
		setImmediate(() => {
			throw err;
		});
	}

	/**
	 * @brief	Fetches the users only one time from the dataStore
	 *
	 * @return	void
	 */
	async fetchUsers()
	{
		if ( this.users === null )
		{
			this.users			= {};
			const usersString	= await this.dataStore.get( USER_KEY ).catch( this.catchError.bind( this ) );

			const usersData		= JSON.parse( typeof usersString !== 'string' ? '[]' : usersString );

			for ( const username in usersData )
			{
				const userData	= usersData[username];
				const user		= new User( userData );

				if ( ! user.isValid() )
				{
					clearInterval( this.flushUserInterval );
					throw new Error( 'Error while fetching users' );
				}

				this.users[user.getUsername()]	= user;
			}
		}
	}

	/**
	 * @brief	Commits any changes to the users to the data store
	 *
	 * @return	void
	 */
	flushUsers()
	{
		const users	= [];

		for ( const userName in this.users )
		{
			const user	= this.users[userName];

			users.push( user.getUserData() );
		}

		this.dataStore.set( USER_KEY, JSON.stringify( users ) ).catch( this.catchError.bind( this ) );
	}

	/**
	 * @brief	Gets a user from the data store
	 *
	 * @param	{String} username
	 *
	 * @return	User
	 */
	get( username )
	{
		if ( ! this.has( username ) )
			throw new Error( `User: ${username} does not exist` );

		return this.users[username];
	}

	/**
	 * @brief	Checks a user in the data store
	 *
	 * @param	{String} username
	 *
	 * @return	Boolean
	 */
	has( username )
	{
		return typeof this.users[username] !== 'undefined';
	}

	/**
	 * @brief	Sets a user in the data store
	 *
	 * @param	{Object} userData
	 *
	 * @return	{User}
	 */
	set( userData )
	{
		if ( typeof userData.username !== 'string' || this.has( userData.username ) )
			throw { code: 'app.main.user.exists', message: `User: ${userData.username} already exist` };

		return this.users[userData.username]	= new User( userData );
	}

	/**
	 * @brief	Updates a user that already exists
	 *
	 * @param	{Object} userData
	 *
	 * @return	{User}
	 */
	update( userData )
	{
		if ( typeof userData.username !== 'string' || ! this.has( userData.username ) )
			throw { code: 'app.main.user.notFound', message: `User: ${userData.username} does not exist` };

		return this.users[userData.username]	= new User( userData );
	}

	/**
	 * @brief	Deletes a user from the data store
	 *
	 * @param	{String} username
	 *
	 * @return	void
	 */
	delete( username )
	{
		if ( ! this.has( username ) )
			throw new Error( `User: ${username} does not exist` );

		delete this.users[username];
	}

	/**
	 * @brief	Returns all users set in the user manager
	 *
	 * @return {Object}
	 */
	getAll()
	{
		return this.users;
	}
}

module.exports	= new UserManager();