'use strict';

// Dependencies
const app			= require( 'event_request' )();
const path			= require( 'path' );
const fs			= require( 'fs' );
const archiver		= require( 'archiver' );
const FileInput		= require( '../input/file_input' );

/**
 * @brief	Callback called when downloading a file fails
 *
 * @param	event EventRequest
 * @param	text String
 *
 * @return	void
 */
const downloadFailedCallback	= ( event, text = 'The file specified does not exist' ) => {
	event.setHeader( 'Content-disposition', 'attachment; filename="error.log"' );
	event.setHeader( 'Content-type', '.log' );

	event.send( text );
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
			return downloadFailedCallback( event, `Invalid input: ${input.getReasonToString()}` );
		}

		const file	= input.getFile();

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
