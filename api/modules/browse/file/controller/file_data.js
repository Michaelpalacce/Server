'use strict';

// Dependencies
const app			= require( 'event_request' )();

const formatItem	= require( '../../../../main/utils/file_formatter' );
const FileInput		= require( '../input/file_input' );
const { stat }		= require( 'fs' ).promises;

/**
 * @brief	Adds a '/file/getFileData' route with method GET
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file/getFileData', async ( event ) => {
	const input		= new FileInput( event );
	const itemName	= input.getFile();

	await stat( itemName ).catch( () => { event.sendError( 'File does not exist', 400 ); });

	event.send( formatItem( itemName, event ) );
});
