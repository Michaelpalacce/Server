'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const path			= require('path');

let router		= Server().Router();

/**
 * @brief	Removes a folder recursively
 *
 * @param	String path
 *
 * @return	void
 */
const deleteFolderRecursive = function( dir )
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
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/delete',
	method	: 'DELETE',
	handler	: ( event ) => {
		let result	= event.validationHandler.validate( event.queryString, { file : 'filled||string' } );

		let file	= ! result.hasValidationFailed()
					? event.queryString.file
					: false;

		if ( file === false || ! fs.existsSync( file ) )
		{
			event.next( 'File does not exist' );
		}
		else
		{
			fs.unlink( file, ( err ) => {
				if ( ! err )
				{
					event.send( [ 'ok' ] );
				}
				else
				{
					event.next( 'Could not delete file' );
				}
			});
		}
	}
});

/**
 * @brief	Adds a '/download' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/delete/folder',
	method	: 'DELETE',
	handler	: ( event ) => {
		let result	= event.validationHandler.validate( event.queryString, { folder : 'filled||string' } );

		let folder	= ! result.hasValidationFailed()
					? result.getValidationResult().folder
					: false;

		if ( folder === false || ! fs.existsSync( folder ) )
		{
			event.next( 'Folder does not exist' );
		}
		else
		{
			if ( folder === '/' )
			{
				event.next( 'CANNOT DELETE ROOT!' );
				return;
			}
			deleteFolderRecursive( folder );
			event.send( ['ok'] );
		}
	}
});

module.exports	= router;
