'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const PathHelper	= require( './../main/path' );
const IpLookup		= require( './../main/ip_address_lookup' );
const path			= require( 'path' );

let router			= Server().Router();

/**
 * @brief	Extracts the dir from the request
 *
 * @param	EventRequest event
 *
 * @returns	String
 */
function getDirFromRoute( event )
{
	const route		= event.session.get( 'route' );
	const result	= event.validationHandler.validate( event.queryString, { dir : 'filled||string' } );
	const dir		= ! result.hasValidationFailed() ? event.queryString.dir : route;

	return dir.includes( route ) ? dir : route
}

/**
 * @brief	Renders the browse page
 *
 * @param	EventRequest event
 *
 * @return	Function
 */
let browseCallback	= ( event ) => {
	const dir			= getDirFromRoute( event );
	const ipInterfaces	= IpLookup.getLocalIpV4s();

	IpLookup.getExternalIpv4().then( ( externalIP ) =>{
		event.render( 'browse', { dir: encodeURIComponent( dir ), ipInterfaces, externalIP } );
	}).catch( event.next );
};

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/browse/getFiles', ( event )=>{
	const dir			= getDirFromRoute( event );
	const pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

	pathHelper.getItems( dir, ( err, items ) => {
		if ( ! err && items && items.length > 0 )
		{
			IpLookup.getExternalIpv4().then( ( externalIP ) =>{
				event.send( { items, dir } );
			}).catch( event.next );
		}
		else
		{
			event.redirect( event.headers.referer );
		}
	});
} );

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.add({
	route	: '/',
	method	: 'GET',
	handler	: browseCallback
});

/**
 * @brief	Adds a '/file/hasPreview' route with method GET
 *
 * @details	Required Parameters: file
 *
 * @return	void
 */
router.add({
	route	: '/file/hasPreview',
	method	: 'GET',
	handler	: ( event )=>{
		const result		= event.validationHandler.validate( event.queryString, { file : 'filled||string' } );

		if ( result.hasValidationFailed() )
		{
			event.send( false );
			return;
		}
		const file			= result.getValidationResult().file;

		const pathHelper	= new PathHelper( event.getFileStreamHandler().getSupportedTypes() );

		event.send( pathHelper.supportedExtensions( path.parse( file ).ext ) );
	}
});


/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.add({
	route	: '/browse',
	method	: 'GET',
	handler	: browseCallback
});

module.exports	= router;
