const Acl			= require( "../../../main/acls/acl" );
const UserManager	= require( "../../../main/user/user_manager" );

/**
 * @brief	Class responsibel for managing Roles
 */
class Roles
{
	/**
	 * @brief	Adds a role to the Acls
	 *
	 * @param	{NewRoleInput} input - The input that contains the role to be added
	 *
	 * @returns	void
	 */
	async addRole( input )
	{
		await Acl.addRole( input.getRole() );
	}

	/**
	 * @brief	Adds a role to the Acls
	 *
	 * @param	{UpdateRoleInput} input - The input that contains the role to be updated
	 *
	 * @returns	void
	 */
	async updateRole( input )
	{
		const roleName	= input.getRoleName();

		console.log(roleName);
		if ( roleName === 'root' )
			throw { code: 'app.users.role.cannotUpdateRoot' };

		await Acl.updateRole( roleName, input.getRolePermissions() );
	}

	/**
	 * @brief	Deletes the given role
	 *
	 * @details	Will not delete a role if users have it or if it is root
	 *
	 * @param	{DeleteRoleInput} input
	 */
	deleteRole( input )
	{
		const roleName	= input.getRoleName();

		if ( roleName === 'root' )
			throw { code: 'app.users.role.cannotDeleteRoot' };

		const usersWithRole	= Object.values( UserManager.getAll() ).filter(( user ) => {
			return user.is( roleName );
		});

		if ( usersWithRole.length !== 0 )
			throw { code: 'app.users.role.inUse' };

		Acl.deleteRole( roleName );
	}
}

module.exports	= Roles;