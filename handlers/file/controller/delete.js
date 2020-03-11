'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const util			= require( 'util' );

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
		const result	= event.validationHandler.validate( event.queryString, { item : 'filled||string' } );

		if ( result.hasValidationFailed() )
		{
			return event.next( 'Invalid item provided', 400 );
		}

		const { item }	= result.getValidationResult();

		if ( ! fs.existsSync( item ) )
		{
			return event.next( 'Item does not exist', 400 );
		}
		else
		{
			if ( fs.statSync( item ).isDirectory() )
			{
				event.sendError( 'Cannot delete directory', 400 );
			}
			else
			{
				unlink( item ).then(()=>{
					event.send( 'ok' );
				}).catch( event.next );
			}
		}
	}
);
