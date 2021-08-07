'use strict';

// Dependencies
const Input	= require( '../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class NewRoleInput extends Input
{
	/**
	 * @return	mixed
	 */
	getRole()
	{
		return this.get( NewRoleInput.ROLE_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				role: {
					name		: 'filled||string',
					permissions	: [
						{
							type: 'filled||string',
							method: 'filled||string',
							route: 'filled||string',
						}
					],
				}
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { role }						= this.reason.getValidationResult();
		this.model[NewRoleInput.ROLE_KEY]	= role;

		return true;
	}
}

NewRoleInput.ROLE_KEY	= 'username';

module.exports			= NewRoleInput;