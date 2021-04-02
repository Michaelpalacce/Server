'use strict';

const User	= require( '../security/user/user' );

/**
 * @brief	Used to prefix ACL keys in the cache
 *
 * @var		{String}
 */
const ACL_PREFIX	= '${SE_ACL}:'
const ROLES_KEY		= `${ACL_PREFIX}_ROLES`;

class Acl
{
	constructor()
	{
		this.dataStore	= process.cachingServer;
		this.roles		= {};

		this._fetchRoles();
	}

	/**
	 * @brief	Fetch the roles from the server once
	 *
	 * @return	{Promise<void>}
	 */
	async _fetchRoles()
	{
		let roles	= await this.dataStore.get( ROLES_KEY );

		if ( roles === null )
		{
			roles	= User.ROLES;
			await this.dataStore.set( ROLES_KEY, roles );
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

	canAccess( permissions )
	{

	}
}

module.exports	= new Acl();