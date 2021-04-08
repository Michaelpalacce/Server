'use strict';

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
}

module.exports	= UserModel;