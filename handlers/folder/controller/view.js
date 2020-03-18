'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

const BrowseInput	= require( '../input/browse_input' );

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
app.get( '/', async ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( 'Invalid params' );

	event.render( 'browse', { dir: encodeURIComponent( input.getDir() ) } );
} );

/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
app.get( '/browse', async ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( 'Invalid params' );

	event.render( 'browse', { dir: encodeURIComponent( input.getDir() ) } );
} );