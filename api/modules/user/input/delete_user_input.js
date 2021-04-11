'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteUserInput extends Input
{
	/**
	 * @return	mixed
	 */
	getUsername()
	{
		return this.get( DeleteUserInput.USERNAME_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.params, { username : 'filled||string||range:3-64' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { username }							= this.reason.getValidationResult();
		this.model[DeleteUserInput.USERNAME_KEY]	= username;

		return true;
	}
}

DeleteUserInput.USERNAME_KEY	= 'username';

module.exports	= DeleteUserInput;