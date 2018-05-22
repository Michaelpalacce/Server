'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const path		= require( './../main/path' );

let router		= new Router();

/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: dir
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/browse', 'GET', ( event ) => {
	// Call the Model get to retrieve data
	let dir	= typeof event.queryStringObject.dir === 'string'
			&& event.queryStringObject.dir.length > 0
			? event.queryStringObject.dir
			: false;

	if ( ! dir )
	{
		event.setError( 'Dir is incorrect' );
		return;
	}

	path.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'browse', { data: items }, ( err ) => {
				if ( err )
				{
					event.setError( err );
				}
			});
		}
		else
		{
			event.setError( err );
		}
	});
});

module.exports	= router;
