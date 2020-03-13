'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const path			= require( 'path' );
const fs			= require( 'fs' );
const archiver		= require( 'archiver' );

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
		const result	= event.validationHandler.validate( event.queryString, { file: 'filled||string||min:1' } );
		const file		= ! result.hasValidationFailed()
						? result.getValidationResult().file
						: false;

		if ( ! file || ! fs.existsSync( file ) )
		{
			downloadFailedCallback( event );
		}
		else
		{
			const fileStats	= path.parse( file );
			const fileName	= fileStats.base.replace( '/', '' );

			if ( fs.lstatSync( file ).isDirectory() )
			{
				event.clearTimeout();
				const archive	= archiver( 'zip', {
					zlib: { level: 9 }
				});

				const output	= event.response;

				archive.pipe( output );
				event.setHeader( 'content-disposition', `attachment; filename="${fileName}.zip"` );
				event.setHeader( 'Content-type', 'zip' );
				archive.directory( file, false );
				archive.finalize();
			}
			else
			{
				event.setHeader( 'content-disposition', `attachment; filename="${fileName}"` );
				event.setHeader( 'Content-type', fileStats.ext );
				event.setHeader( 'Content-Length', fs.statSync( file ).size );

				try
				{
					event.clearTimeout();
					event.send( fs.createReadStream( file ) );
				}
				catch ( e )
				{
					downloadFailedCallback( event );
				}
			}
		}
	}
);
