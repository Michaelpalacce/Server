'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();
const PathHelper	= require( '../../main/utils/path' );
const BrowseInput	= require( '../input/browse_input' );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir, position
 *
 * @return	void
 */
app.get( '/browse/getFiles', ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( `Invalid input: ${input.getReasonToString()}` );

	const dir	= input.getDirectory();

	PathHelper.getItems( event, dir, input.getPosition() ).then(( data ) => {
		const { items, position, hasMore }	= data;

		event.send( { items, position, dir, hasMore } )
	}).catch( event.next );
} );
