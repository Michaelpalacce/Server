'use strict';

const path				= require( 'path' );
const fs				= require( 'fs' );
const { promisify }		= require( 'util' );
const mv				= require( 'mv' );
const rename			= promisify( mv );
const forbiddenDirs		= require( '../../utils/forbidden_folders' );
const { itemInFolder }	= require( '../../utils/folders' );

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

		const route		= this.user.getBrowseMetadata().getRoute();
		const directory	= uploadInput.getDirectory();

		for ( const forbiddenDir of forbiddenDirs )
			if ( ! itemInFolder( directory, route ) || itemInFolder( directory, forbiddenDir ) )
				throw { code: 'app.browse.upload.unauthorized', message : `No permissions to upload to ${directory}`, status: 403 };

		this.event.clearTimeout();

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
