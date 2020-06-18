'use strict';

// Dependencies
const app			= require( 'event_request' )();
const fs			= require( 'fs' );
const path			= require( 'path' );
const DeleteInput	= require( '../input/delete_input' );

/**
 * @brief	Removes a folder recursively
 *
 * @param	String dir
 *
 * @return	void
 */
const deleteFolderRecursive	= function( dir )
{
	if ( fs.existsSync( dir ) )
	{
		fs.readdirSync( dir ).forEach( ( file ) =>
		{
			const curPath	= path.join( dir, file );
			if ( fs.lstatSync( curPath ).isDirectory() )
			{
				deleteFolderRecursive( curPath );
			}
			else
			{
				fs.unlinkSync( curPath );
			}
		});

		fs.rmdirSync( dir );
	}
};

/**
 * @brief	Adds a '/delete' route with method GET
 *
 * @details	Required Parameters: file || folder
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.delete( '/folder', ( event ) => {
		const input	= new DeleteInput( event );

		if ( ! input.isValid() )
		{
			return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );
		}

		deleteFolderRecursive( input.getDirectory() );
		event.send( 'ok' );
	}
);
