'use strict';

const path					= require( 'path' );
const fs					= require( 'fs' );
const { mkdir }				= fs.promises;

const PROJECT_ROOT			= path.parse( require.main.filename ).dir;
const FORBIDDEN_CHARACTERS	= [ '<', '>', ':', '|', '?', '*' ];

/**
 * @brief	Model responsible for creating folders if the user has permission to do so
 */
class UploadModel
{
	/**
	 * @param	{EventRequest} event
	 */
	constructor( event )
	{
		this.event	= event;
		this.user	= event.$user;
	}

	/**
	 * @brief	Creates the given folder
	 *
	 * @param	{UploadInput} uploadInput
	 *
	 * @return	{Promise<void>}
	 */
	async createFolder( uploadInput )
	{
		if ( ! uploadInput.isValid() )
			throw { code: 'app.input.invalidUploadInput', message : uploadInput.getReasonToString() };

		const directory			= uploadInput.getDirectory();
		const route				= this.user.getBrowseMetadata().getRoute();

		const resolvedDirectory	= path.resolve( directory );
		const resolvedRoute		= path.resolve( route );

		if ( resolvedDirectory.includes( PROJECT_ROOT ) || PROJECT_ROOT.includes( resolvedDirectory ) )
			throw { code: 'app.browse.upload.unauthorized', message: `Cannot create folder in project ROOT ${resolvedDirectory}`, status: 403 };

		if ( ! resolvedDirectory.includes( resolvedRoute ) )
			throw { code: 'app.browse.upload.unauthorized', message: `No permissions to create ${resolvedDirectory}`, status: 403 };

		if ( fs.existsSync( directory ) )
			throw { code: 'app.browse.upload.directoryExists', message: `Directory already exists: ${resolvedDirectory}`, status: 400 };

		if ( directory === '/' )
			throw { code: 'app.browse.upload.tryingToCreateRoot', message: 'Cannot create root', status: 400 };

		for ( const charIndex in FORBIDDEN_CHARACTERS )
		{
			const character	= FORBIDDEN_CHARACTERS[charIndex];
			if ( directory.includes( character ) )
				throw { code: 'app.browse.upload.forbiddenCharacter', message: `Folder name contains an invalid character: ${character}`, status: 400 };
		}

		return mkdir( directory );
	}
}

module.exports	= UploadModel;
