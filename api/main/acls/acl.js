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
					type: 'ALLOW',
					route: new RegExp( /^\/api\/browse?(.+)/ ),
					method: ''
				},
				{
					type: 'ALLOW',
					route: '/api/user',
					method: 'DELETE'
				},
				{
					type: 'ALLOW',
					route: '/api/user/password',
					method: 'PUT'
				},
				{
					type: 'DENY',
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
			await this.flushRoles();
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
	 * @brief	Adds a new role
	 *
	 * @throws	If the role name already exists
	 *
	 * @param	{Array} role - The role to be added
	 */
	async addRole( role )
	{
		const roleName	= role.name;

		if ( typeof this.roles[roleName] !== 'undefined' )
		{
			this.roles[roleName]	= role;
			await this.flushRoles();
		}
		else
			throw { code: 'app.acl.roleExists', status: 400 };

	}

	/**
	 * @brief	Flushes the roles to the cache
	 *
	 * @return	void
	 */
	async flushRoles()
	{
		await this.dataStore.set( ROLES_KEY, formatPermissions( this.roles ) );
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
				permissions	= mixPermissions( permissions, this.roles[role].permissions );

		user.setPermissions( permissions );
	}

	canAccess( permissions )
	{

	}
}

module.exports	= new Acl();