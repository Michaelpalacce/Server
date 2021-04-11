'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class ChangePasswordInput extends Input
{
	/**
	 * @return	mixed
	 */
	getPassword()
	{
		return this.get( ChangePasswordInput.PASSWORD_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				password	: 'filled||string||range:3-64',
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { password }								= this.reason.getValidationResult();
		this.model[ChangePasswordInput.PASSWORD_KEY]	= password;

		return true;
	}
}

ChangePasswordInput.PASSWORD_KEY	= 'password';

module.exports	= ChangePasswordInput;