'use strict';

const REGEX_PATTERN	= '${RE}:'

/**
 * @brief	Holds user information
 */
class User
{
	constructor( userData = {} )
	{
		this.username		= userData.username || '';
		this.password		= userData.password || '';
		this.route			= typeof userData.route === 'string' ? userData.route : '/';
		this.permissions	= this._parsePermissions( userData.permissions || '{"test":"1"}' );
	}

	/**
	 * @brief	Parses the permissions by decoding the JSON
	 *
	 * @details	Further creates regex patterns if any were defined
	 *
	 * @param	{Object} permissions
	 *
	 * @return	Object
	 */
	_parsePermissions( permissions )
	{
		return typeof permissions !== 'string' ? permissions : JSON.parse( permissions, ( key, value ) => {
			if ( typeof value === 'string' && value.includes( REGEX_PATTERN ) )
				value	= new RegExp( value.substring( REGEX_PATTERN.length ) );

			return value;
		});
	}

	/**
	 * @brief	Formats the permissions
	 *
	 * @param	{Object} permissions
	 *
	 * @return	Object
	 */
	_formatPermissions( permissions )
	{
		return JSON.stringify( permissions, ( key, value ) => {
			if( value instanceof RegExp )
				return `${REGEX_PATTERN}value.source`;
			else
				return value;
		});
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
			route		: this.route,
			permissions	: this._formatPermissions( this.permissions ),
		};
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
			&& typeof this.password === 'string'
			&& typeof this.route === 'string'
			&& typeof this.permissions === 'object';
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
	 * @brief	Returns the user's permissions
	 *
	 * @return	String
	 */
	getPermissions()
	{
		return this.permissions;
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