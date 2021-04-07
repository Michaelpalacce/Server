'use strict';

/**
 * @brief	User list model responsible for listing all the users
 */
class ListModel
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
}

module.exports	= ListModel;