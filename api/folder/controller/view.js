'use strict';

// Dependencies
const app			= require( 'event_request' )();
const BrowseInput	= require( '../input/browse_input' );

/**
 * @param	{EventRequest} event
 *
 * @return	{Promise<void>}
 */
const browseCallback	= async ( event ) => {
	const input	= new BrowseInput( event );

	event.send( { dir: input.getEncodedDirectory() } ).catch( event.next );
};

/**
 * @brief	Adds a '/' and '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
app	.get( '/', browseCallback )
	.get( '/browse', browseCallback );
