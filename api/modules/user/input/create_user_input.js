'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class CreateUserInput extends Input
{
	/**
	 * @return	mixed
	 */
	getUsername()
	{
		return this.get( CreateUserInput.USERNAME_KEY );
	}

	/**
	 * @return	mixed
	 */
	getPassword()
	{
		return this.get( CreateUserInput.PASSWORD_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				username	: 'filled||string||range:3-64',
				password	: 'filled||string||range:3-64',
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { username, password }				= this.reason.getValidationResult();

		this.model[CreateUserInput.USERNAME_KEY]	= username;
		this.model[CreateUserInput.PASSWORD_KEY]	= password;

		return true;
	}
}

CreateUserInput.USERNAME_KEY	= 'username';
CreateUserInput.PASSWORD_KEY	= 'password';

module.exports	= CreateUserInput;