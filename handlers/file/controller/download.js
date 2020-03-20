'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const path			= require( 'path' );
const fs			= require( 'fs' );
const archiver		= require( 'archiver' );
const FileInput		= require( '../input/file_input' );

const app			= Server();

/**
 * @brief	Callback called when downloading a file fails
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
const downloadFailedCallback	= ( event ) => {
	event.setHeader( 'Content-disposition', 'attachment; filename="error.log"' );
	event.setHeader( 'Content-type', '.log' );

	event.send( 'The file specified does not exist' );
};

/**
 * @brief	Adds a '/file' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file', ( event ) => {
		const input	= new FileInput( event );

		if ( ! input.isValid() )
		{
			return downloadFailedCallback( event );
		}

		const file	= input.getFile();

		if ( ! fs.existsSync( file ) )
		{
			return downloadFailedCallback( event );
		}

		event.clearTimeout();

		const fileStats	= path.parse( file );
		const fileName	= fileStats.base.replace( '/', '' );

		if ( fs.lstatSync( file ).isDirectory() )
		{
			const archive	= archiver( 'zip', {
				zlib: { level: 9 }
			});

			archive.pipe( event.response );
			event.setHeader( 'content-disposition', `attachment; filename="${fileName}.zip"` );
			event.setHeader( 'Content-type', 'zip' );

			try
			{
				archive.directory( file, false );
				archive.finalize();
			}
			catch ( e )
			{
				downloadFailedCallback( event );
			}
		}
		else
		{
			event.setHeader( 'content-disposition', `attachment; filename="${fileName}"` );
			event.setHeader( 'Content-type', fileStats.ext );
			event.setHeader( 'Content-Length', fs.statSync( file ).size );

			try
			{
				event.send( fs.createReadStream( file ) );
			}
			catch ( e )
			{
				downloadFailedCallback( event );
			}
		}
	}
);
