'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );
const path	= require( 'path' );
const fs	= require( 'fs' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

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
		if ( ! this.event.session.has( 'route' ) || ! this.event.session.has( 'SU' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		const isSU	= this.event.session.get( 'SU' );
		const route	= this.event.session.get( 'route' );

		this.reason	= this.validationHandler.validate( this.event.queryString, { file : 'filled||string||min:1' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { file }		= this.reason.getValidationResult();
		file				= Buffer.from( decodeURIComponent( file ), 'base64' ).toString();

		const resolvedFile	= path.resolve( file );
		const resolvedRoute	= path.resolve( route );

		if ( resolvedFile.includes( PROJECT_ROOT ) )
		{
			this.reason	= `Cannot access file in project ROOT ${PROJECT_ROOT}`;
			return false;
		}

		if ( ! isSU && ! resolvedFile.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to access ${resolvedFile}`;
			return false;
		}

		if ( ! fs.existsSync( file ) )
		{
			this.reason	= `File does not exist: ${resolvedFile}`;
			return false;
		}

		this.model[FileInput.FILE_KEY]	= file;

		return true;
	}
}

FileInput.FILE_KEY	= 'file';

module.exports	= FileInput;