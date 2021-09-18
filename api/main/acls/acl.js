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
					route: new RegExp( /^\/api\/dashboard?(.+)/ ),
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
	}

	/**
	 * @brief	Fetch the roles from the dataStore
	 *
	 * @return	{Promise<void>}
	 */
	async fetchRoles()
	{
		let roles	= parsePermissions( await this.dataStore.get( ROLES_KEY ) );

		if ( roles === null )
		{
			roles	= DEFAULT_ROLES;
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
	 * @param	{Object} role - The role to be added
	 *
	 * @return	void
	 */
	async addRole( role )
	{
		const roleName	= role.name;

		if ( ! this.roleExists( roleName ) )
		{
			this.roles[roleName]	= role;

			await this.flushRoles();
		}
		else
			throw { code: 'app.acl.roleExists', status: 400 };
	}

	/**
	 * @brief	Updates an existing role
	 *
	 * @throws	If the role name does not exist
	 *
	 * @param	{String} name - The role name
	 * @param	{Array} permissions - The role permissions
	 *
	 * @return	void
	 */
	async updateRole( name, permissions )
	{
		if ( this.roleExists( name ) )
		{
			this.roles[name]	= { name, permissions };

			await this.flushRoles();
		}
		else
			throw { code: 'app.acl.roleDoesNotExist', status: 400 };
	}

	/**
	 * @brief	Deletes a given role
	 *
	 * @param	{String} roleName
	 *
	 * @return	void
	 */
	async deleteRole( roleName )
	{
		if ( this.roleExists( roleName ) )
			delete this.roles[roleName];
	}

	/**
	 * @brief	Deletes a given role
	 *
	 * @param	{String} roleName
	 *
	 * @return	{Boolean}
	 */
	roleExists( roleName )
	{
		return typeof this.roles[roleName] !== 'undefined';
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
	 * @return	{User}
	 */
	decorateUserWithPermissions( user )
	{
		const userRoles	= user.getRoles();
		let permissions	= user.getUserPermissions();

		for ( const role of userRoles )
			if ( typeof this.roles[role] !== 'undefined' )
				permissions	= mixPermissions( permissions, this.roles[role].permissions );

		user.setPermissions( permissions );

		return user;
	}

	canAccess( permissions )
	{

	}
}

module.exports	= new Acl();
