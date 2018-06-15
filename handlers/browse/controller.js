'use strict';

// Dependencies
const { Router }	= require( 'event_request' );
const PathHelper	= require( './../main/path' );

let router			= new Router();

let browseCallback	= ( event ) => {
	// Call the Model get to retrieve data
	let dir	= typeof event.queryString.dir === 'string'
			&& event.queryString.dir.length > 0
			? event.queryString.dir
			: '/';

	if ( ! dir )
	{
		event.sendError( 'Dir is incorrect' );
		return;
	}

	let pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'browse', { data: items, dir: dir }, ( err ) => {
				if ( err )
				{
					event.sendError( 'Could not render template' );
				}
			});
		}
		else
		{
			event.sendError( 'Could not get items' );
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
router.add({
	route	: '/',
	method	: 'GET',
	handler	: browseCallback
});


/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: directory
 *
 * @return	void
 */
router.add({
	route	: '/browse',
	method	: 'GET',
	handler	: browseCallback
});

module.exports	= router;
