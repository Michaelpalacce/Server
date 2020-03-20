'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class FileInput extends Input
{
	/**
	 * @brief	Returns the file
	 *
	 * @returns	mixed
	 */
	getFile()
	{
		return this.get( FileInput.FILE_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.queryString, { file : 'filled||string||min:1' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { file }	= this.reason.getValidationResult();
		this.model[FileInput.FILE_KEY]	= file;

		return true;
	}
}

FileInput.FILE_KEY	= 'file';

module.exports	= FileInput;