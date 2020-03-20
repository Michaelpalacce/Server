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
			return event.next( 'Invalid item provided', 400 );
		}

		const item	= input.getItem();

		if ( ! fs.existsSync( item ) )
		{
			return event.next( 'Item does not exist', 400 );
		}

		if ( fs.statSync( item ).isDirectory() )
		{
			return event.sendError( 'Cannot delete directory', 400 );
		}

		unlink( item ).then(()=>{
			event.send( 'ok' );
		}).catch( event.next );
	}
);
