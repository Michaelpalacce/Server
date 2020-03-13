'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const util			= require( 'util' );
const path			= require('path');

const unlink		= util.promisify( fs.unlink );
const app			= Server();

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
		const result	= event.validationHandler.validate( event.queryString, { item : 'optional||string' } );

		if ( result.hasValidationFailed() )
		{
			return event.next( 'Invalid item provided', 400 );
		}

		let { item }	= result.getValidationResult();

		if ( ! fs.existsSync( item ) )
		{
			return event.next( 'Item does not exist', 400 );
		}
		else
		{
			if ( fs.statSync( item ).isDirectory() )
			{
				if ( item === '/' )
				{
					return event.next( 'CANNOT DELETE ROOT!', 400 );
				}

				deleteFolderRecursive( item );
				event.send( 'ok' );
			}
			else
			{
				event.sendError( 'Trying to delete a file', 400 );
			}
		}
	}
);
