'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const PathHelper	= require( './../main/path' );

let router			= Server().Router();

let browseCallback	= ( event ) => {
	let path		= event.session.get( 'path' );
	let result		= event.validationHandler.validate( event.queryString, { dir : 'filled||string' } );

	let dir			= ! result.hasValidationFailed() ? event.queryString.dir : path;
	dir				= dir.includes( path ) ? dir : path;

	let pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			const Messages	= event.cachingServer.model( 'Messages' );

			// @todo get all
			event.render( 'browse', { data: items, dir: dir } );
		}
		else
		{
			event.redirect( event.headers.referer );
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
	handler	: ( event )=>{
		event.redirect( '/browse' );
	}
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
