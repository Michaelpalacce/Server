'use strict';

const BrowseMetadata	= require( './metadata/browse' );

const REGEX_PATTERN		= '${RE}:'

/**
 * @brief	Used to dynamically get the revivers
 *
 * @var		{Object}
 */
const metadataPool		= {
	'BrowseMetadata'	: BrowseMetadata
}

/**
 * @brief	Holds user information
 */
class User
{
	constructor( userData = {} )
	{
		this.username		= userData.username || '';
		this.password		= userData.password || '';
		this.roles			= userData.roles || [];
		this.metadata		= this._parseMetadata( userData.metadata || '{}' );
		this.permissions	= this._parsePermissions( userData.permissions || '{}' );
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
			if ( typeof value !== 'undefined' && typeof value.regexp !== 'undefined' )
				value	= new RegExp( value.regexp.source, value.regexp.flags );

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
				return { regexp: { source: value.source, flags: value.flags } };
			else
				return value;
		});
	}

	/**
	 * @brief	Parses the metadata by decoding the JSON
	 *
	 * @param	{Object} metadata
	 *
	 * @return	Object
	 */
	_parseMetadata( metadata )
	{
		return typeof metadata !== 'string' ? metadata : JSON.parse( metadata, ( key, value ) => {
			if ( typeof value === 'object' && typeof metadataPool[key] !== 'undefined' )
				value	= new metadataPool[key]( value.metadata );

			return value;
		});
	}

	/**
	 * @brief	Formats the metadata using the metadata's replacers
	 *
	 * @param	{Object} metadata
	 *
	 * @return	Object
	 */
	_formatMetadata( metadata )
	{
		return JSON.stringify( metadata, ( key, value ) => {
			if ( typeof metadataPool[key] !== 'undefined' )
				return { metadata: value };

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
		const metadata	= this._formatMetadata( this.metadata );
		return {
			username	: this.username,
			password	: this.password,
			metadata	: metadata,
			permissions	: this._formatPermissions( this.permissions ),
			roles		: this.roles
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
			&& typeof this.metadata === 'object'
			&& typeof this.permissions === 'object'
			&& Array.isArray( this.roles );
	}

	/**
	 * @brief	Returns the username
	 *
	 * @return	{String}
	 */
	getUsername()
	{
		return this.username;
	}

	/**
	 * @brief	Returns the user's permissions
	 *
	 * @return	{Array}
	 */
	getPermissions()
	{
		return this.permissions;
	}

	/**
	 * @brief	Returns the user's roles
	 *
	 * @return	{Array}
	 */
	getRoles()
	{
		return this.roles;
	}

	/**
	 * @brief	Returns the password
	 *
	 * @return	{String}
	 */
	getPassword()
	{
		return this.password;
	}

	/**
	 * @brief	Returns the requested metadata by key
	 *
	 * @details	If the metadata does not exist, throws
	 *
	 * @return	{Object}
	 */
	getMetadata( key )
	{
		if ( typeof this.metadata[key] === 'undefined' )
			if ( typeof metadataPool[key] !== 'string' )
				this.metadata[key]	= new metadataPool[key]( {} );
			else
				throw { code: 'app.user.invalidMetadata', message: 'Internal Server Error' };

		return this.metadata[key];
	}

	/**
	 * @brief	Gets the browse metadata and sets it up if it is not already setUp
	 *
	 * @return	{BrowseMetadata}
	 */
	getBrowseMetadata()
	{
		const metadata	= this.getMetadata( 'BrowseMetadata' );

		if ( ! metadata.hasRoute() )
			metadata.setDefaultRoute();

		return metadata;
	}
}

User.ROLES	= {
	root: 'root',
	user: 'user'
}

module.exports	= User;