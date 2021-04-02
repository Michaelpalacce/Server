'use strict';

// Dependencies
const app		= require( 'event_request' )();
const FileInput	= require( '../input/file_input' );

/**
 * @brief	Adds a '/file/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file/data', ( event ) => {
	const input	= new FileInput( event );

	event.getFileStream( input.getFile() ).pipe( event.response );
});
