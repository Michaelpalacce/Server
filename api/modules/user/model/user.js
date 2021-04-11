'use strict';

const Acl	= require( '../../../main/acls/acl' );

/**
 * @brief	User model responsible for CRUD operations on the current user
 */
class UserModel
{
	/**
	 * @param	{EventRequest} event
	 */
	constructor( event )
	{
		this.event			= event
		this.user			= event.$user;
		this.userManager	= event.$userManager;
	}

	/**
	 * @brief	Deletes the current user
	 *
	 * @details	Will throw an error if the user does not exist
	 *
	 * @return	void
	 */
	async deleteUser()
	{
		const username	= this._getUsername();

		if ( username === process.env.ADMIN_USERNAME )
			throw { code: 'app.user.delete.root', message : 'Cannot delete root user!' };

		this.userManager.delete( username );
		await this.event.session.removeSession();
	}

	/**
	 * @brief	Changes the current user password
	 *
	 * @param	{ChangePasswordInput} changePasswordInput
	 */
	changePassword( changePasswordInput )
	{
		if ( ! changePasswordInput.isValid() )
			throw { code: 'app.input.invalidChangePasswordInput', message : changePasswordInput.getReasonToString() };

		const user	= this.userManager.get( this._getUsername() );

		if ( user.getUsername() === process.env.ADMIN_USERNAME )
			throw { code: 'app.user.edit.root', message : 'Cannot edit root user!' };

		user.setPassword( changePasswordInput.getPassword() );
	}

	/**
	 * @brief	Gets the username from the session
	 *
	 * @return	{String}
	 */
	_getUsername()
	{
		return this.event.session.get( 'username' );
	}
}

module.exports	= UserModel;