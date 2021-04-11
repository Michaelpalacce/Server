'use strict';

const User	= require( '../../../main/user/user' );

/**
 * @brief	User list model responsible for listing all the users
 */
class UserModel
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

		const newUser		= new User( newUserData );
		const oldUser		= new User( oldUserData );

		if ( newUser.getUsername() !== oldUser.getUsername() )
		{
			this.userManager.delete( oldUser.getUsername() );
			this.userManager.set( newUserData );

			if ( oldUser.getUsername() === this.user.getUsername() )
				this.event.session.add( 'username', newUser.getUsername() );
		}
		else
			if ( ! this.userManager.has( newUser.getUsername() ) )
				throw { code: 'app.user.userNotFound', message : `User: ${newUser.getUsername()} does not exists` };
			else
				this.userManager.update( newUserData );

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
			throw { code: 'app.user.userNotFound', message : `User: ${username} does not exists` };

		this.userManager.delete( username );
	}
}

module.exports	= UserModel;