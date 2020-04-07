'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

const formatItem	= require( '../../main/utils/file_formatter' );
const FileInput		= require( '../input/file_input' );
const { stat }		= require( 'fs' ).promises;

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
		return event.send( `Invalid input provided: ${input.getReasonToString()}`, 400 );
	}

	const itemName	= input.getFile();

	stat( itemName ).then(()=>{
		event.send( formatItem( itemName, event ) );
	}).catch( ()=>{
		event.sendError( 'File does not exist', 400 );
	} );
} );
