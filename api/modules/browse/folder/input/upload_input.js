'use strict';

// Dependencies
const Input					= require( '../../../../main/validation/input' );
const path					= require( 'path' );
const fs					= require( 'fs' );

const PROJECT_ROOT			= path.parse( require.main.filename ).dir;
const FORBIDDEN_CHARACTERS	= [ '<', '>', ':', '|', '?', '*' ];

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
		const isSU	= this.event.session.get( 'SU' );
		const route	= this.event.session.get( 'route' );

		this.reason	= this.validationHandler.validate( this.event.body, { directory : 'optional||string' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { directory }		= this.reason.getValidationResult();
		directory				= Buffer.from( decodeURIComponent( directory ), 'base64' ).toString();

		const resolvedDirectory	= path.resolve( directory );
		const resolvedRoute		= path.resolve( route );

		if ( resolvedDirectory.includes( PROJECT_ROOT ) || PROJECT_ROOT.includes( resolvedDirectory ) )
		{
			this.reason	= `Cannot create folder in project ROOT ${resolvedDirectory}`;
			return false;
		}

		if ( ! isSU && ! resolvedDirectory.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to create ${resolvedDirectory}`;
			return false;
		}

		if ( fs.existsSync( directory ) )
		{
			this.reason	= `Directory already exists: ${resolvedDirectory}`;
			return false;
		}

		if ( directory === '/' )
		{
			this.reason	= `Cannot create root`;
			return false;
		}

		for ( const charIndex in FORBIDDEN_CHARACTERS )
		{
			const character	= FORBIDDEN_CHARACTERS[charIndex];
			if ( directory.includes( character ) )
			{
				this.reason	= `Folder name contains an invalid character: ${character}`;
				return false;
			}
		}

		this.model[UploadInput.DIRECTORY_KEY]	= directory;

		return true;
	}
}

UploadInput.DIRECTORY_KEY	= 'directory';

module.exports	= UploadInput;