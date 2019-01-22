'use strict';

// Dependencies
const { Router }	= require( 'event_request' );
const PathHelper	= require( './../main/path' );

let router			= new Router();

let browseCallback	= ( event ) => {
	let result		= event.validationHandler.validate( event.queryString, { dir : 'filled||string' } );
	
	let dir			= ! result.hasValidationFailed()
					? event.queryString.dir
					: '/';

	let pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			event.render( 'browse', { data: items, dir: dir } );
		}
		else
		{
			event.next( 'Could not get items' );
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
