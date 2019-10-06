'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const PathHelper	= require( './../main/path' );
const IpLookup		= require( './../main/ip_address_lookup' );

let router			= Server().Router();

let browseCallback	= ( event ) => {
	let route			= event.session.get( 'route' );
	let result			= event.validationHandler.validate( event.queryString, { dir : 'filled||string' } );

	let dir				= ! result.hasValidationFailed() ? event.queryString.dir : route;
	dir					= dir.includes( route ) ? dir : route;

	let pathHelper		= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );
	let ipInterfaces	= IpLookup.getLocalIpV4s();

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			IpLookup.getExternalIpv4().then( ( externalIP ) =>{
				event.render( 'browse', { data: items, dir, ipInterfaces, externalIP } );
			}).catch( event.next );
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
