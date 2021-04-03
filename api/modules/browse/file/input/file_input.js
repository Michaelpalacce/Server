'use strict';

// Dependencies
const Input					= require( '../../../../main/validation/input' );
const path					= require( 'path' );
const fs					= require( 'fs' );
const { encode, decode }	= require( '../../../../main/utils/base_64_encoder' );


const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Validates that the provided request contains the correct data
 */
class FileInput extends Input
{
	/**
	 * @brief	Returns the file
	 *
	 * @returns	String
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
		this.reason	= this.validationHandler.validate( this.event.query, { file : 'filled||string||min:1' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { file }					= this.reason.getValidationResult();
		this.model[FileInput.FILE_KEY]	= decode( file );

		return true;
	}
}

FileInput.FILE_KEY	= 'file';

module.exports		= FileInput;