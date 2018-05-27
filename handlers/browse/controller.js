'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const path		= require( './../main/path' );

let router		= new Router();

let browseCallback	= ( event ) => {
	// Call the Model get to retrieve data
	let dir	= typeof event.queryStringObject.dir === 'string'
			&& event.queryStringObject.dir.length > 0
			? event.queryStringObject.dir
			: '/';

	if ( ! dir )
	{
		event.setError( 'Dir is incorrect' );
		return;
	}

	path.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'browse', { data: items, dir: dir }, ( err ) => {
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
};

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: directory
 *
 * @return	void
 */
router.add( '/', 'GET', browseCallback );

/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: directory
 *
 * @return	void
 */
router.add( '/browse', 'GET', browseCallback );

module.exports	= router;
