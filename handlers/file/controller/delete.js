'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const util			= require( 'util' );
const DeleteInput	= require( '../input/delete_input' );

const unlink		= util.promisify( fs.unlink );
const app			= Server();

/**
 * @brief	Adds a '/file' route with method DELETE
 *
 * @details	Required Parameters: item
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.delete( '/file', ( event ) => {
		const input	= new DeleteInput( event );

		if ( ! input.isValid() )
		{
			return event.next( `Invalid input: ${input.getReasonToString()}`, 400 );
		}

		const item	= input.getItem();

		unlink( item ).then(()=>{
			event.send( 'ok' );
		}).catch( event.next );
	}
);
