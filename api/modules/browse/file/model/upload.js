'use strict';

const path			= require( 'path' );
const fs			= require( 'fs' );
const { promisify }	= require( 'util' );
const mv			= require( 'mv' );
const rename		= promisify( mv );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Upload model responsible for uploading files if the user has permissions to
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
	 * @brief	Uploads all the files given
	 *
	 * @param	{UploadInput} uploadInput
	 *
	 * @return	{Promise<void>}
	 */
	async upload( uploadInput )
	{
		if ( ! uploadInput.isValid() )
			throw { code: 'app.input.invalidUploadInput', message : uploadInput.getReasonToString() };

		const route			= this.user.getBrowseMetadata().getRoute();
		const resolvedDir	= path.resolve( uploadInput.getDirectory() );
		const resolvedRoute	= path.resolve( route );

		if ( ! resolvedDir.includes( resolvedRoute ) || resolvedDir.includes( PROJECT_ROOT ) )
			throw { code: 'app.browse.upload.unauthorized', message : `No permissions to upload to ${resolvedDir}`, status: 403 };

		this.event.clearTimeout();

		const directory	= uploadInput.getDirectory();
		const files		= uploadInput.getFiles();

		for ( const file of files )
		{
			const oldPath	= file.path;
			const fileName	= path.parse( file.name );

			let newPath		= path.join( directory, fileName.dir );
			newPath			= path.join( newPath, fileName.name + fileName.ext );

			const fileStats	= path.parse( newPath );

			if ( ! fs.existsSync( fileStats.dir ) )
				fs.mkdirSync( fileStats.dir, { recursive: true } );

			await rename( oldPath, newPath );
		}
	}
}

module.exports	= UploadModel;