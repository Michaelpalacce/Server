'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const path			= require( 'path' );
const fs			= require( 'fs' );

let router	= Server().Router();

/**
 * @brief	Callback called when downloading a file fails
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
let downloadFailedCallback	= ( event ) => {
	event.setHeader( 'Content-disposition', 'attachment; filename=error.txt' );
	event.setHeader( 'Content-type', '.txt' );
	event.next( 'The file specified does not exist' );
};

/**
 * @brief	Adds a '/download' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/download', ( event ) => {
		const result	= event.validationHandler.validate( event.queryString, { file: 'filled||string||min:1' } );

		let file	= ! result.hasValidationFailed()
					? result.getValidationResult().file
					: false;

		if ( ! file || ! fs.existsSync( file ) )
		{
			downloadFailedCallback( event );
		}
		else
		{
			let fileStats	= path.parse( file );
			event.response.setHeader( 'Content-disposition', 'attachment; filename=' + fileStats.base );
			event.response.setHeader( 'Content-type', fileStats.ext );
			event.response.setHeader( 'Content-Length', fs.statSync( file ).size );
			event.clearTimeout();
			try
			{
				let fStream	= fs.createReadStream( file );

				fStream.pipe( event.response );
			}
			catch ( e )
			{
				downloadFailedCallback( event );
			}
		}
	}
);

module.exports	= router;
