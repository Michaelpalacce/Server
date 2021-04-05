'use strict';

// Dependencies
const app			= require( 'event_request' )();
const DeleteInput	= require( '../input/delete_input' );
const DeleteModel	= require( '../model/delete' );

/**
 * @brief	Adds a '/delete' route with method DELETE
 *
 * @details	Required Parameters: item
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.delete( '/folder', ( event ) => {
	const input	= new DeleteInput( event );
	const model	= new DeleteModel( event );

	model.delete( input );

	event.send();
});
