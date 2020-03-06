'use strict';

const IpLookup		= require( '../../main/ip_address_lookup' );
const PathHelper	= require( '../../main/path' );
const fs			= require( 'fs' );
const path			= require( 'path' );
const { promisify }	= require( 'util' );

const stat			= promisify( fs.stat );

const BrowseModel	= {};

/**
 * @brief	Extracts the dir from the request
 *
 * @param	EventRequest eventRequest
 *
 * @returns	String
 */
function getDirFromRoute( eventRequest ) {
	const route		= eventRequest.session.get( 'route' );
	const result	= eventRequest.validationHandler.validate( eventRequest.queryString, { dir : 'filled||string' } );
	const dir		= ! result.hasValidationFailed() ? eventRequest.queryString.dir : route;

	return dir.includes( route ) ? dir : route
}

/**
 * @brief	Extracts the position from the request
 *
 * @param	EventRequest eventRequest
 *
 * @returns	Number
 */
function getPositionFromRoute( eventRequest ) {
	const result	= eventRequest.validationHandler.validate( eventRequest.queryString, { position : 'filled||numeric' } );

	return ! result.hasValidationFailed() ? parseInt( eventRequest.queryString.position ) : 0
}

/**
 * @brief	Renders the browse page
 *
 * @param	EventRequest eventRequest
 *
 * @return	Function
 */
BrowseModel.browseAction			= async function( eventRequest ) {
	const dir			= getDirFromRoute( eventRequest );
	const ipInterfaces	= IpLookup.getLocalIpV4s();
	const externalIP	= await IpLookup.getExternalIpv4().catch( eventRequest.next );

	eventRequest.render( 'browse', { dir: encodeURIComponent( dir ), ipInterfaces, externalIP } );
};

/**
 * @brief	Returns paginated files for the given directory
 *
 * @param	EventRequest eventRequest
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
BrowseModel.getFilesAction			= function( eventRequest ) {
	const dir			= getDirFromRoute( eventRequest );
	const position		= getPositionFromRoute( eventRequest );
	const pathHelper	= new PathHelper();
	const getItems		= promisify( pathHelper.getItems );

	getItems( eventRequest, dir, position ).then(( data ) => {
		const { items, position, hasMore }	= data;

		eventRequest.send( { items, position, dir, hasMore, workingDir: dir } );
	}).catch(()=>{
		eventRequest.redirect( eventRequest.headers.referer );
	});
};

/**
 * @brief	Gets info about the given file
 *
 * @param	EventRequest event
 *
 * @return	void
 */
BrowseModel.getFilesData	= function( event ){
	const result	= event.validationHandler.validate( event.queryString, { file : 'filled||string' } );

	if ( result.hasValidationFailed() )
	{
		return event.send( false );
	}

	const fileName	= result.getValidationResult().file;
	stat( fileName ).then(( stats )=>{
		event.send( PathHelper.formatItem( path.parse( fileName ), stats, false, event ) );
	}).catch(()=>{
		event.sendError( 'File does not exist', 400 );
	});
};

module.exports	= BrowseModel;
