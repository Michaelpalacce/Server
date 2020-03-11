const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class FileDataInput extends Input
{
	/**
	 * @brief	Returns the file for which data should be returned
	 *
	 * @returns	mixed
	 */
	getFile()
	{
		return this.get( FileDataInput.FILE_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		const result	= this.validationHandler.validate( this.event.queryString, { file : 'filled||string' } );

		if ( result.hasValidationFailed() )
			return false;

		const { file }	= result.getValidationResult();

		this.model[FileDataInput.FILE_KEY]	= file;

		return true;
	}
}

FileDataInput.FILE_KEY	= 'file';

module.exports	= FileDataInput;