'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const path			= require( 'path' );
const fs			= require( 'fs' );

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
			event.setHeader( 'content-disposition', `attachment; filename="${fileStats.base}"`);
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
);
