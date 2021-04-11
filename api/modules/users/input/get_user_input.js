'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class GetUserInput extends Input
{
	/**
	 * @return	mixed
	 */
	getUsername()
	{
		return this.get( GetUserInput.USERNAME_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.params, { username : 'filled||string||range:3-64' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { username }						= this.reason.getValidationResult();
		this.model[GetUserInput.USERNAME_KEY]	= username;

		return true;
	}
}

GetUserInput.USERNAME_KEY	= 'username';

module.exports	= GetUserInput;