'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );

const app			= Server();

/**
 * @brief	Adds a '/file/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file/data', ( event ) =>{
		const result	= event.validationHandler.validate( event.queryString, { file: 'filled||string||min:1' } );

		const file		= ! result.hasValidationFailed()
						? result.getValidationResult().file
						: false;

		if ( ! file || ! fs.existsSync( file ) )
		{
			return event.next( 'File does not exist', 400 );
		}

		event.getFileStream( file ).pipe( event.response );
	}
);
