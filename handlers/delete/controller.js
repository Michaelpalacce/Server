'use strict';

// Dependencies
const Server	= require( 'event_request' );
const fs		= require( 'fs' );

let router		= new Server.Router();

/**
 * @brief	Adds a '/download' route with method GET
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
		let file	= typeof event.queryString.file === 'string'
					&& event.queryString.file.length > 0
					? event.queryString.file
					: false;

		if ( ! file || ! fs.existsSync( file ) )
		{
			event.sendError( 'File does not exist' );
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
					event.sendError( 'Could not delete file' );
				}
			});
		}
	}
});

module.exports	= router;
