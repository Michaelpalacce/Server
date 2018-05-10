'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const model		= require( './module' );

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
	// Call the Model get to retrieve data
	model.get( event, ( err, data )=> {
		if ( ! err && data )
		{
			event.render( 'index', data, ( err ) => {
				if ( err )
				{
					event.next();
				}
			});
		}
		else
		{
			event.next();
		}
	});
});

module.exports	= router;