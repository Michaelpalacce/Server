'use strict';

// Dependencies
const app		= require( 'event_request' )();

const FileInput	= require( '../input/file_input' );
const FileModel	= require( '../model/file' );

/**
 * @brief	Adds a '/api/file/getFileData' route with method GET
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/api/file/getFileData', async ( event ) => {
	const input		= new FileInput( event );
	const model		= new FileModel( event );
	const result	= await model.getFile( input ).catch( event.next );

	event.send( result );
});
