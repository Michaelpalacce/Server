const Acl	= require( "../../../main/acls/acl" );

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
}

module.exports	= Roles;