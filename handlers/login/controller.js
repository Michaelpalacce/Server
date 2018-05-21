'use strict';

// Dependencies
const Router		= require( './../../lib/server/router' );

let router		= new Router();

/**
 * @brief	Adds a '/login' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/login', 'GET', ( event ) => {
	event.render( 'login', {}, ( err ) => {
		if ( err )
		{
			event.setError( err );
			event.next();
		}
	});
});
/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: dir
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/login', 'POST', ( event ) => {
	event.redirect( '/' );
	event.next();
});

module.exports	= router;
