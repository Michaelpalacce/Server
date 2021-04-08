'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UpdateUserInput extends Input
{
	/**
	 * @return	mixed
	 */
	getNewUserData()
	{
		return this.get( UpdateUserInput.NEW_USER_DATA_KEY );
	}

	/**
	 * @return	mixed
	 */
	getOldUserData()
	{
		return this.get( UpdateUserInput.OLD_USER_DATA_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				newUser: {
					username	: 'filled||string||range:3-64',
					password	: 'filled||string||range:3-64',
					metadata	: 'filled',
					permissions	: 'filled',
					roles		: 'filled||array'
				},
				oldUser: {
					username	: 'filled||string||range:3-64',
					password	: 'filled||string||range:3-64',
					metadata	: 'filled',
					permissions	: 'filled',
					roles		: 'filled||array'
				}
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { newUser, oldUser }					= this.reason.getValidationResult();
		this.model[UpdateUserInput.NEW_USER_DATA_KEY]	= newUser;
		this.model[UpdateUserInput.OLD_USER_DATA_KEY]	= oldUser;

		return true;
	}
}

UpdateUserInput.NEW_USER_DATA_KEY	= 'new_user_data';
UpdateUserInput.OLD_USER_DATA_KEY	= 'old_user_data';

module.exports	= UpdateUserInput;