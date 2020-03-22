'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const FileInput		= require( '../input/file_input' );

const app			= Server();

/**
 * @brief	Adds a '/file/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/file/data', ( event ) =>{
		const input	= new FileInput( event );
		if ( ! input.isValid() )
		{
			return event.next( `Invalid input provided: ${input.getReasonToString()}`, 400 );
		}

		const file	= input.getFile();

		if ( ! fs.existsSync( file ) )
		{
			return event.next( 'File does not exist', 400 );
		}

		event.getFileStream( file ).pipe( event.response );
	}
);
