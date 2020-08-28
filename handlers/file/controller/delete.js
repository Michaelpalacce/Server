'use strict';

// Dependencies
const app				= require( 'event_request' )();
const fs				= require( 'fs' );
const util				= require( 'util' );
const DeleteInput		= require( '../input/delete_input' );

const unlink			= util.promisify( fs.unlink );

const itemValidation	= { item : 'filled||string' };

/**
 * @brief	Adds a '/file' route with method DELETE
 *
 * @details	Required Parameters: item
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.delete( '/file', app.er_validation.validate( { query: itemValidation } ), async ( event ) => {
	const input	= new DeleteInput( event );
	await unlink( input.getItem() ).catch( event.next );

	event.send();
});
