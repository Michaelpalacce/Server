'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const router		= Server().Router();
const PathHelper	= require( '../../main/path' );
const BrowseInput	= require( '../input/input' );
const IpLookup		= require( '../../main/ip_address_lookup' );
const { promisify }	= require( 'util' );
const fs			= require( 'fs' );
const path			= require( 'path' );

const stat			= promisify( fs.stat );

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/', async ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( 'Invalid params' );

	const ipInterfaces	= IpLookup.getLocalIpV4s();
	const externalIP	= await IpLookup.getExternalIpv4().catch( event.next );

	event.render( 'browse', { dir: encodeURIComponent( input.getDir() ), ipInterfaces, externalIP } );
} );

/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/browse', async ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( 'Invalid params' );

	const ipInterfaces	= IpLookup.getLocalIpV4s();
	const externalIP	= await IpLookup.getExternalIpv4().catch( event.next );

	event.render( 'browse', { dir: encodeURIComponent( input.getDir() ), ipInterfaces, externalIP } );
} );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir, position
 *
 * @return	void
 */
router.get( '/browse/getFiles', ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( 'Invalid params' );

	const dir	= input.getDir();

	PathHelper.getItems( event, dir, input.getPosition() ).then(( data ) => {
		const { items, position, hasMore }	= data;

		event.send( { items, position, dir, hasMore } )
	}).catch(()=>{
		event.redirect( event.headers.referer );
	});
} );

/**
 * @brief	Adds a '/file/hasPreview' route with method GET
 *
 * @param	event EventRequest
 *
 * @details	Required Parameters: file
 *
 * @return	void
 */
router.get( '/file/getFileData', ( event )=>{
	const result	= event.validationHandler.validate( event.queryString, { file : 'filled||string' } );

	if ( result.hasValidationFailed() )
	{
		return event.send( false );
	}

	const fileName	= result.getValidationResult().file;

	stat( fileName ).then(( stats )=>{
		event.send( PathHelper.formatItem( path.parse( fileName ), stats, false, event ) );
	}).catch(( e )=>{
		event.sendError( 'File does not exist', 400 );
	});
} );

module.exports	= router;
