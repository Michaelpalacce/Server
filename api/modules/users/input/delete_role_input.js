'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteRoleInput extends Input
{
	/**
	 * @return	{String}
	 */
	getRoleName()
	{
		return this.get( DeleteRoleInput.ROLE_NAME );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.params,
			{
				roleName	: 'filled||string'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { roleName }						= this.reason.getValidationResult();
		this.model[DeleteRoleInput.ROLE_NAME]	= roleName;

		return true;
	}
}

DeleteRoleInput.ROLE_NAME	= 'roleName';

module.exports			= DeleteRoleInput;