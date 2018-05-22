'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );

let router		= new Router();

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/', 'GET', ( event ) => {
	event.redirect( '/browse' );
});

module.exports	= router;
