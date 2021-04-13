'use strict';

// Dependencies
const app			= require( 'event_request' )();
const BrowseInput	= require( '../input/browse_input' );
const BrowseModel	= require( '../model/browse' )
const router		= app.Router();

/**
 * @brief	Adds a '/api/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/browse', async ( event ) => {
	const input		= new BrowseInput( event );
	const model		= new BrowseModel( event );
	const result	= await model.browse( input ).catch( event.next );

	event.send( result );
});

module.exports	= router;