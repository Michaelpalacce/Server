'use strict';

const Users		= require( '../../../main/user/user' );
const Acl		= require( '../../../main/acls/acl' );
const crypto	= require( 'crypto' );

/**
 * @brief	Users model responsible for CRUD operations on users
 */
class UsersModel
{
	/**
	 * @param	{EventRequest} event
	 */
	constructor( event )
	{
		this.event			= event
		this.user			= event.$user;
		this.userManager	= event.$userManager;
	}

	/**
	 * @brief	Gets all usernames
	 *
	 * @return	{Array}
	 */
	getAllUsers()
	{
		return Object.keys( this.userManager.getAll() );
	}

	/**
	 * @brief	Gets the requested user
	 *
	 * @param	{GetUserInput} getUserInput
	 *
	 * @return	{User}
	 */
	getUser( getUserInput )
	{
		if ( ! getUserInput.isValid() )
			throw { code: 'app.input.invalidGetUserInput', message : getUserInput.getReasonToString() };

		const username	= getUserInput.getUsername();

		if ( ! this.userManager.has( username ) )
			throw { code: 'app.user.userNotFound', message : `User: ${username} does not exists` };

		return this.userManager.get( username );
	}

	/**
	 * @brief	Updates the given user
	 *
	 * @details	Checks if there is a username change
	 * 			Will not update a user that does not exist
	 * 			Returns the new user on success
	 *
	 * @param	{UpdateUserInput} updateUserInput
	 *
	 * @return	{User}
	 */
	updateUser( updateUserInput )
	{
		if ( ! updateUserInput.isValid() )
			throw { code: 'app.input.invalidGetUserInput', message : updateUserInput.getReasonToString() };

		const newUserData	= updateUserInput.getNewUserData();
		const oldUserData	= updateUserInput.getOldUserData();

		const newUser		= new Users( newUserData );
		const oldUser		= new Users( oldUserData );

		if ( oldUser.getUsername() === process.env.ADMIN_USERNAME )
			throw { code: 'app.user.update.root', message : 'Cannot update root user!' };

		if ( newUser.getUsername() !== oldUser.getUsername() )
		{
			if ( this.userManager.has( newUser.getUsername() ) )
				throw { code: 'app.user.userAlreadyExists', message : `User: ${newUser.getUsername()} already exists` };

			this.userManager.delete( oldUser.getUsername() );
			this.userManager.set( newUserData );

			if ( oldUser.getUsername() === this.user.getUsername() )
				this.event.session.add( 'username', newUser.getUsername() );
		}
		else
			if ( ! this.userManager.has( newUser.getUsername() ) )
				throw { code: 'app.user.userNotFound', message : `User: ${newUser.getUsername()} does not exists` };
			else
			{
				if ( newUser.getPassword() !== oldUser.getPassword() )
					newUserData.password	= crypto.createHash( 'sha256' ).update( newUser.getPassword() ).digest( 'hex' );

				Acl.decorateUserWithPermissions( this.userManager.update( newUserData ) );
			}

		return this.userManager.get( newUser.getUsername() );
	}

	/**
	 * @brief	Deletes the given user
	 *
	 * @details	Will throw an error if the user does not exist
	 *
	 * @param	{DeleteUserInput} deleteUserInput
	 *
	 * @return	void
	 */
	deleteUser( deleteUserInput )
	{
		if ( ! deleteUserInput.isValid() )
			throw { code: 'app.input.invalidDeleteUserInput', message : deleteUserInput.getReasonToString() };

		const username	= deleteUserInput.getUsername();

		if ( ! this.userManager.has( username ) )
			throw { code: 'app.user.userNotFound', message : `User: ${username} does not exists!` };

		if ( username === process.env.ADMIN_USERNAME )
			throw { code: 'app.user.delete.root', message : 'Cannot delete root user!' };

		this.userManager.delete( username );
	}

	/**
	 * @brief	Creates a user
	 *
	 * @details	Will check if the user already exists
	 *
	 * @param	{CreateUserInput} createUserInput
	 *
	 * @return	{User}
	 */
	createUser( createUserInput )
	{
		if ( ! createUserInput.isValid() )
			throw { code: 'app.input.invalidCreateUserInput', message : createUserInput.getReasonToString() };

		const username	= createUserInput.getUsername();
		const password	= crypto.createHash( 'sha256' ).update( createUserInput.getPassword() ).digest( 'hex' );

		if ( this.userManager.has( username ) )
			throw { code: 'app.user.userExists', message : `User: ${username} already exists` };

		const user	= this.userManager.set( { username, password, roles: [Acl.getRoles().user.name] } );

		user.getBrowseMetadata().setRoute( `${process.env.USER_DATA_PATH}/${user.getUsername()}` );

		return user;
	}
}

module.exports	= UsersModel;
