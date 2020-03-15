/**
 * @brief	Holds user information
 */
class User
{
	constructor( userData = {} )
	{
		this.username		= userData.username || '';
		this.password		= userData.password || '';
		this.isSU			= userData.isSU || false;
		this.route			= userData.route || '/';
		this.permissions	= userData.permissions || [];
	}

	/**
	 * @brief	Checks if the user is a valid user
	 *
	 * @returns	Boolean
	 */
	isValid()
	{
		return this.username !== '' && typeof this.username === 'string';
	}

	/**
	 * @brief	Returns the username
	 *
	 * @return	String
	 */
	getUsername()
	{
		return this.username;
	}

	/**
	 * @brief	Returns the password
	 *
	 * @return	String
	 */
	getPassword()
	{
		return this.password;
	}

	/**
	 * @brief	Returns the route
	 *
	 * @return	String
	 */
	getRoute()
	{
		return this.route;
	}
}

module.exports	= User;