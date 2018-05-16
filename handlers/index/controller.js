'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const path		= require( './../main/path' );

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
	let startDir	= '/';
	path.getItems( startDir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'index', { data: items }, ( err ) => {
				if ( err )
				{
					event.setError( err );
					event.next();
				}
			});
		}
		else
		{
			event.setError( err );
			event.next();
		}
	});
});

module.exports	= router;
