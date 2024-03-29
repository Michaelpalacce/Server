'use strict';

// Dependencies
const User			= require( './user' );
const path			= require( 'path' );
const DataServer	= require( 'event_request/server/components/caching/data_server' );
const Acl			= require( '../acls/acl' );

const USER_KEY		= 'USERS_DATA';
const persistPath	= require( '../utils/config_path' );
const PERSIST_TIME	= 1000;

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
			persistInterval	: 10,	// Every 10 seconds
			gcInterval		: 3600,	// One hour
			persistPath		: path.join( persistPath, 'se_users.json' )
		});
		this.users				= null;

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

				const roles	= user.getRoles().filter( role => Acl.roleExists( role ) );
				user.setRoles( roles );

				this.users[user.getUsername()]	= user;
			}
		}
	}

	/**
	 * @brief	Commits any changes to the users to the data store
	 *
	 * @details	Will not flush users if they have not yet been fetched or if there are no users
	 *
	 * @return	void
	 */
	flushUsers()
	{
		if ( this.users === null || this.users.length === 0 )
			return;

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
