'use strict';

// Dependencies
const app			= require( 'event_request' )();
const { mkdir }		= require( 'fs' ).promises;
const UploadInput	= require( '../input/upload_input' );

/**
 * @brief	Adds a '/folder' route with method PUT
 *
 * @details	Creates a new folder
 *
 * @details	Required Parameters: folder
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder', ( event ) => {
		const input	= new UploadInput( event );

		if ( ! input.isValid() )
		{
			event.next( `Invalid input: ${input.getReasonToString()}`, 400 );
			return;
		}

		try
		{
			mkdir( input.getDirectory() ).then(()=>{
				event.send( 'ok', 201 );
			}).catch( event.next );
		}
		catch ( e )
		{
			event.sendError( 'Could not create folder', 400 );
		}
	}
);
