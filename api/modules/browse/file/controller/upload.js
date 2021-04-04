'use strict';

// Dependencies
const app				= require( 'event_request' )();
const UploadInput		= require( '../input/upload_input' );
const UploadModel		= require( '../model/upload' );
/**
 * @brief	Adds a '/file' route with method POST
 *
 * @details	Saves the file async
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/file', ( event ) => {
	const input	= new UploadInput( event );
	const model	= new UploadModel( event );

	model.upload( input ).then(() => {
		event.send( '', 201 );
	}).catch( event.next );
});
