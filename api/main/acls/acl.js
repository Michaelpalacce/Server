'use strict';

const { parsePermissions, formatPermissions, mixPermissions }	= require( './permissions_helper' );

/**
 * @brief	Used to prefix ACL keys in the cache
 *
 * @var		{String}
 */
const ACL_PREFIX	= '${SE_ACL}:'
const ROLES_KEY		= `${ACL_PREFIX}_ROLES`;
const DEFAULT_ROLES	= {
	root: {
		name		: 'root',
		permissions	: {
			route: [
				{
					type: 'ALLOW',
					route: '',
					method: ''
				}
			]
		}
	},
	user: {
		name		: 'user',
		permissions	: {
			route: [
				{
					type: 'DENY',
					route: new RegExp( /^\/users?(.+)/ ),
					method: ''
				},
				{
					type: 'ALLOW',
					route: '',
					method: ''
				}
			]
		}
	},
	user2: {
		name		: 'user2',
		permissions	: {
			route: [
				{
					type: 'DENY',
					route: new RegExp( /^\/users?(.+)/ ),
					method: ''
				},
				{
					type: 'ALLOW',
					route: '',
					method: ''
				}
			]
		}
	},
	user3: {
		name		: 'user3',
		permissions	: {
			route: [
				{
					type: 'DENY',
					route: new RegExp( /^\/users?(.+)/ ),
					method: ''
				},
				{
					type: 'ALLOW',
					route: '',
					method: ''
				}
			]
		}
	},
};

/**
 * @brief	Acl class responsible for handling permissions
 */
class Acl
{
	constructor()
	{
		this.dataStore	= process.cachingServer;
		this.roles		= DEFAULT_ROLES;

		this._fetchRoles();
	}

	/**
	 * @brief	Fetch the roles from the dataStore
	 *
	 * @return	{Promise<void>}
	 */
	async _fetchRoles()
	{
		let roles	= parsePermissions( await this.dataStore.get( ROLES_KEY ) );

		if ( roles === null )
		{
			roles	= this.roles;
			await this.dataStore.set( ROLES_KEY, formatPermissions( roles ) );
		}

		this.roles	= roles;
	}

	/**
	 * @brief	Checks if the user is a given role
	 *
	 * @details	The role requested will also be checked if it exists in the set roles
	 *
	 * @param	{User} user
	 * @param	{String} role
	 *
	 * @return	{Boolean}
	 */
	is( user, role )
	{
		return user.getRoles().includes( role ) && typeof this.roles[role] !== 'undefined';
	}

	/**
	 * @brief	Gets all possible roles
	 *
	 * @return	{Object}
	 */
	getRoles()
	{
		return this.roles;
	}

	/**
	 * @brief	Decorates the user with role based permissions
	 *
	 * @param	{User} user
	 *
	 * @return	{void}
	 */
	decorateUserWithPermissions( user )
	{
		const userRoles	= user.getRoles();
		let permissions	= user.getUserPermissions();

		for ( const role of userRoles )
			if ( typeof this.roles[role] !== 'undefined' )
				permissions	= mixPermissions( this.roles[role].permissions, permissions );

		user.setPermissions( permissions );
	}

	canAccess( permissions )
	{

	}
}

module.exports	= new Acl();