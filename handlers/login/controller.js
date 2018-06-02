'use strict';

// Dependencies
const Server	= require( './../../lib/www' );

let router		= new Server.Router();

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
		}
	});
});
/**
 * @brief	Adds a '/login' route with method POST
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/login', 'POST', ( event ) => {
	event.redirect( '/browse' );
	event.next();
});

module.exports	= router;
