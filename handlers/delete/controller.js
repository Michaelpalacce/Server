'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const path		= require( 'path' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Adds a '/download' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/delete', 'DELETE', ( event ) => {
	let file	= typeof event.queryStringObject.file === 'string'
				&& event.queryStringObject.file.length > 0
				? event.queryStringObject.file
				: false;

	if ( ! file || ! fs.existsSync( file ) )
	{
		event.setError( 'File does not exist' );
	}
	else
	{
		fs.unlink( file, ( err ) => {
			if ( ! err )
			{
				event.setResponse( [ 'ok' ] );
			}
			else
			{
				event.setError( 'Could not delete file' );
			}
		});
	}
});

module.exports	= router;
