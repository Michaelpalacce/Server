'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );
const path			= require( 'path' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

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
		if ( ! this.event.session.has( 'route' ) || ! this.event.session.has( 'SU' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		const isSU	= this.event.session.get( 'SU' );
		const route	= this.event.session.get( 'route' );

		this.reason	= this.validationHandler.validate( this.event.body, { directory : 'filled||string', $files : 'filled' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { directory, $files }	= this.reason.getValidationResult();
		directory					= Buffer.from( decodeURIComponent( directory ), 'base64' ).toString();

		const resolvedDir			= path.resolve( directory );
		const resolvedRoute			= path.resolve( route );

		if ( resolvedDir.includes( PROJECT_ROOT ) )
		{
			this.reason	= `Cannot upload files in project ROOT ${PROJECT_ROOT}`;
			return false;
		}

		if ( ! isSU && ! resolvedDir.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to upload to ${resolvedDir}`;
			return false;
		}

		this.model[UploadInput.DIRECTORY_KEY]	= directory;
		this.model[UploadInput.FILES_KEY]		= $files;

		return true;
	}
}

UploadInput.DIRECTORY_KEY	= 'directory';
UploadInput.FILES_KEY		= '$files';

module.exports	= UploadInput;