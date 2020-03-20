'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UploadInput extends Input
{
	/**
	 * @brief	Returns the file
	 *
	 * @returns	mixed
	 */
	getDirectory()
	{
		return this.get( UploadInput.DIRECTORY_KEY );
	}

	/**
	 * @brief	Gets the files for download
	 *
	 * @returns	mixed
	 */
	getFiles()
	{
		return this.get( UploadInput.FILES_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.body, { directory : 'filled||string', $files : 'filled' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { directory, $files }				= this.reason.getValidationResult();

		this.model[UploadInput.DIRECTORY_KEY]	= decodeURIComponent( directory );
		this.model[UploadInput.FILES_KEY]		= $files;

		return true;
	}
}

UploadInput.DIRECTORY_KEY	= 'directory';
UploadInput.FILES_KEY		= '$files';

module.exports	= UploadInput;