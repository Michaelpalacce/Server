'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

const PathHelper	= require( '../../main/utils/path' );
const FileInput		= require( '../input/file_input' );
const { promisify }	= require( 'util' );
const fs			= require( 'fs' );
const path			= require( 'path' );

const stat			= promisify( fs.stat );

/**
 * @brief	Adds a '/file/getFileData' route with method GET
 *
 * @param	event EventRequest
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file/getFileData', ( event )=>{
	const input	= new FileInput( event );

	if ( ! input.isValid() )
	{
		return event.send( false );
	}

	const file	= input.getFile();

	stat( file ).then(( stats )=>{
		event.send( PathHelper.formatItem( path.parse( file ), stats, false, event ) );
	}).catch(( e )=>{
		event.sendError( 'File does not exist', 400 );
	});
} );
