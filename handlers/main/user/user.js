/**
 * @brief	Holds user information
 */
class User
{
	constructor( userData = {} )
	{
		this.username		= userData.username || '';
		this.password		= userData.password || '';
		this.isSU			= userData.isSU === 'true' || userData.isSU === true;
		this.route			= typeof userData.route === 'string' ? userData.route : '/';
		this.permissions	= userData.permissions || [];

		if ( this.isSU )
		{
			this.route	= '/';
		}
	}

	/**
	 * @brief	Gets the user in an object
	 *
	 * @return	Object
	 */
	getUserData()
	{
		return {
			username	: this.username,
			password	: this.password,
			isSU		: this.isSU,
			route		: this.route,
			permissions	: this.permissions,
		}
	}

	/**
	 * @brief	Checks if the user is a valid user
	 *
	 * @returns	Boolean
	 */
	isValid()
	{
		return this.username !== ''
			&& typeof this.username === 'string'
			&& typeof this.isSU === 'boolean'
			&& typeof this.password === 'string'
			&& typeof this.route === 'string';
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

	/**
	 * @brief	Returns if the user is a super user or not
	 *
	 * @return	Boolean
	 */
	isSuperUser()
	{
		return this.isSU;
	}
}

module.exports	= User;