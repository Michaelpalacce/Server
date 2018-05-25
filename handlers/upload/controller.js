'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Adds a '/upload' route with method POST
 *
 * @TODO    Implement this! Do some extra research!
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/upload', 'POST', ( event ) => {
	// event.redirect( '/' );
	event.next();
});

// Export the module
module.exports	= router;
