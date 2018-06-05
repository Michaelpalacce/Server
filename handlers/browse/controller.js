'use strict';

// Dependencies
const Server		= require( 'event_request' );
const PathHelper	= require( './../main/path' );

let router			= new Server.Router();

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

	let pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'browse', { data: items, dir: dir }, ( err ) => {
				if ( err )
				{
					event.setError( 'Could not render template' );
				}
			});
		}
		else
		{
			event.setError( 'Could not get items' );
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
