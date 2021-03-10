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
 * @param	{EventRequest} event
 * @param	{String} text
 *
 * @return	void
 */
const downloadFailedCallback	= ( event, text = 'The file specified does not exist' ) => {
	event.setResponseHeader( 'Content-disposition', 'attachment; filename="error.log"' );
	event.setResponseHeader( 'Content-type', '.log' );

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
	const file	= input.getFile();

	event.clearTimeout();

	const fileStats	= path.parse( file );
	const fileName	= fileStats.base.replace( '/', '' );

	if ( fs.lstatSync( file ).isDirectory() )
	{
		const archive	= archiver( 'zip', { zlib: { level: 9 } } );

		archive.pipe( event.response );
		event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}.zip"` );
		event.setResponseHeader( 'Content-type', 'zip' );

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
		event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}"` );
		event.setResponseHeader( 'Content-type', fileStats.ext );
		event.setResponseHeader( 'Content-Length', fs.statSync( file ).size );

		try
		{
			fs.createReadStream( file ).pipe( event.response );
		}
		catch ( e )
		{
			downloadFailedCallback( event );
		}
	}
});
