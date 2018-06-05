'use strict';

// Dependencies
const Server	= require( 'event_request' );

let router		= new Server.Router();

/**
 * @brief	Adds a '/login' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/login',
	method	: 'GET',
	handler	: ( event ) => {

		event.render( 'login', {}, ( err ) => {
			if ( err )
			{
				event.setError( err );
			}
		});
	}
});

/**
 * @brief	Adds a '/login' route with method POST
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/login',
	method	: 'POST',
	handler	: ( event ) => {
		event.redirect( '/browse' );
	},
});

module.exports	= router;
