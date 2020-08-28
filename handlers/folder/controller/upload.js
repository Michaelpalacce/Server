'use strict';

// Dependencies
const app			= require( 'event_request' )();
const { mkdir }		= require( 'fs' ).promises;
const UploadInput	= require( '../input/upload_input' );

/**
 * @brief	Adds a '/folder' route with method PUT
 *
 * @details	Creates a new folder
 *
 * @details	Required Parameters: folder
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder', async ( event ) => {
	const input	= new UploadInput( event );
	await mkdir( input.getDirectory() ).catch( event.next );

	event.send( '', 201 );
});
