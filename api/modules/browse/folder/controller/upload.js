'use strict';

// Dependencies
const app			= require( 'event_request' )();
const UploadInput	= require( '../input/upload_input' );
const UploadModel	= require( '../model/upload' );
const router		= app.Router();

/**
 * @brief	Adds a '/api/browse/folder' route with method PUT
 *
 * @details	Creates a new folder
 *
 * @details	Required Parameters: directory
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/folder', async ( event ) => {
	const input	= new UploadInput( event );
	const model	= new UploadModel( event );

	await model.createFolder( input ).catch( event.next );

	event.send( '', 201 );
});

module.exports	= router;
