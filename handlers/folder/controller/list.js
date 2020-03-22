'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();
const BrowseInput	= require( '../input/browse_input' );
const FileSystem	= require( '../../main/utils/file_system' );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir, position
 *
 * @return	void
 */
app.get( '/browse/getFiles', ( event )=>{
	const input	= new BrowseInput( event );

	if ( ! input.isValid() )
		throw new Error( `Invalid input: ${input.getReasonToString()}` );

	const dir			= input.getDirectory();
	const fileSystem	= new FileSystem( event );

	fileSystem.getAllItems( dir, input.getToken() ).then(( response )=>{
		response.dir		= dir;
		response.nextToken	= encodeURIComponent( Buffer.from( JSON.stringify( response.nextToken ) ).toString( 'base64' ) );
		event.send( response )
	}).catch( event.next );
} );
