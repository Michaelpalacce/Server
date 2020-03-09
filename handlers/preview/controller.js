'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const PathHelper	= require( './../main/path' );

let router			= Server().Router();

/**
 * @brief	Adds a '/preview' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/preview', ( event ) => {
		const result		= event.validationHandler.validate( event.queryString, { file: 'filled||string||min:1' } );

		const file			= ! result.hasValidationFailed()
							? result.getValidationResult().file
							: false;

		const fileStream	= PathHelper.getFileStreamerForFile( event, file );

		if ( ! file || ! fs.existsSync( file ) || fileStream === null )
		{
			return event.sendError( 'File does not exist', 400 );
		}

		event.render( 'preview', { type: fileStream.getType(), src: '/data?file=' + encodeURIComponent( file ) }, event.next );
	}
);

/**
 * @brief	Adds a '/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/data', ( event ) =>{
		const result	= event.validationHandler.validate( event.queryString, { file: 'filled||string||min:1' } );

		const file		= ! result.hasValidationFailed()
						? result.getValidationResult().file
						: false;

		if ( ! file || ! fs.existsSync( file ) )
		{
			return event.next( 'File does not exist' );
		}

		event.getFileStream( file ).pipe( event.response );
	}
);

module.exports	= router;
