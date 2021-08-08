'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UpdateRoleInput extends Input
{
	/**
	 * @return	mixed
	 */
	getRolePermissions()
	{
		return this.get( UpdateRoleInput.ROLE_PERMISSIONS );
	}

	/**
	 * @return	mixed
	 */
	getRoleName()
	{
		return this.get( UpdateRoleInput.NAME_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				permissions	: {
					route: [
						{
							type: 'filled||string',
							method: 'optional||string',
							route: 'optional'
						}
					]
				}
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { permissions }							= this.reason.getValidationResult();
		this.model[UpdateRoleInput.ROLE_PERMISSIONS]	= permissions;

		this.reason	= this.validationHandler.validate(
			this.event.params,
			{
				roleName	: 'filled||string'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { roleName }						= this.reason.getValidationResult();
		this.model[UpdateRoleInput.NAME_KEY]	= roleName;

		return true;
	}
}

UpdateRoleInput.ROLE_PERMISSIONS	= 'role_permissions';
UpdateRoleInput.NAME_KEY			= 'name';

module.exports						= UpdateRoleInput;