'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UploadInput extends Input
{
	/**
	 * @brief	Returns the directory
	 *
	 * @returns	String
	 */
	getDirectory()
	{
		return this.get( UploadInput.DIRECTORY_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.body, { directory : 'optional||string' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { directory }						= this.reason.getValidationResult();
		this.model[UploadInput.DIRECTORY_KEY]	= decode( directory );

		return true;
	}
}

UploadInput.DIRECTORY_KEY	= 'directory';

module.exports	= UploadInput;