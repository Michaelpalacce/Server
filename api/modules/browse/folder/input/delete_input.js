'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteInput extends Input
{
	/**
	 * @brief	Returns the directory
	 *
	 * @returns	String
	 */
	getDirectory()
	{
		return this.get( DeleteInput.DIRECTORY_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.query, { item : 'optional||string' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { item }							= this.reason.getValidationResult();
		this.model[DeleteInput.DIRECTORY_KEY]	= decode( item );

		return true;
	}
}

DeleteInput.DIRECTORY_KEY	= 'dir';

module.exports	= DeleteInput;