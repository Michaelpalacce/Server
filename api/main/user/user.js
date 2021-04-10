'use strict';

const BrowseMetadata											= require( './metadata/browse' );
const { formatPermissions, parsePermissions, mixPermissions }	= require( '../acls/permissions_helper' );

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
	/**
	 * @details	permissions hold permissions set by the rules
	 * 			userPermissions hold permissions set specifically for the user
	 *
	 * @param	{Object} userData
	 */
	constructor( userData = {} )
	{
		this.username			= typeof userData.username === 'string' ? userData.username : '';
		this.password			= typeof userData.password === 'string' ? userData.password : '';
		this.roles				= Array.isArray( userData.roles ) ? userData.roles : [];
		this.metadata			= this._parseMetadata( userData.metadata || '{}' );
		this.permissions		= parsePermissions( userData.permissions || '{}' );
		this.userPermissions	= parsePermissions( userData.userPermissions || '{}' );
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
		return {
			username		: this.username,
			password		: this.password,
			metadata		: this._formatMetadata( this.metadata ),
			userPermissions	: this.getFormattedPermissions(),
			permissions		: this.getFormattedPermissions(),
			roles			: this.roles
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
	 * @param	{String} username
	 *
	 * @return	{Boolean}
	 */
	setUsername( username )
	{
		if ( typeof username !== 'string' )
			return false;

		this.username	= username;
		return true;
	}

	/**
	 * @brief	Returns the role's permissions
	 *
	 * @return	{Object}
	 */
	getPermissions()
	{
		return this.permissions;
	}

	/**
	 * @brief	Returns the role's and the user's permissions mixed
	 *
	 * @return	{Object}
	 */
	getAllPermissions()
	{
		return mixPermissions( this.userPermissions, this.permissions );
	}

	/**
	 * @brief	Returns the user's permissions
	 *
	 * @return	{Object}
	 */
	getUserPermissions()
	{
		return this.userPermissions;
	}

	/**
	 * @brief	Returns the role's permissions formatted ( for saving and displaying )
	 *
	 * @return	{String}
	 */
	getFormattedPermissions()
	{
		return formatPermissions( this.permissions );
	}

	/**
	 * @brief	Returns the user's permissions formatted ( for saving and displaying )
	 *
	 * @return	{String}
	 */
	getFormattedUserPermissions()
	{
		return formatPermissions( this.userPermissions );
	}

	/**
	 * @param	{String|Object} permissions
	 *
	 * @return	{Boolean}
	 */
	setPermissions( permissions )
	{
		this.permissions	= typeof permissions !== 'string' ? parsePermissions( permissions ) : permissions;

		return true;
	}

	/**
	 * @param	{String|Object} userPermissions
	 *
	 * @return	{Boolean}
	 */
	setUserPermissions( userPermissions )
	{
		this.userPermissions	= typeof userPermissions !== 'string' ? parsePermissions( userPermissions ) : userPermissions;

		return true;
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
	 * @param	{Array} roles
	 *
	 * @return	{Boolean}
	 */
	setRoles( roles )
	{
		if ( ! Array.isArray( roles ) )
			return false;

		this.roles	= roles;
		return true;
	}

	/**
	 * @param	{String} role
	 *
	 * @return	{Boolean}
	 */
	addRole( role )
	{
		if ( typeof role !== 'string' )
			return false;

		this.roles.push( role );

		return true;
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
	 * @param	{String} password
	 *
	 * @return	{Boolean}
	 */
	setPassword( password )
	{
		if ( typeof password !== 'string' )
			return false;

		this.password	= password;
		return true;
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

module.exports	= User;