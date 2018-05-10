'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const path		= require( 'path' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Callback called when downloading a file fails
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
let downloadFailedCallback	= ( event ) => {
	event.response.setHeader( 'Content-disposition', 'attachment; filename=error.txt' );
	event.response.setHeader( 'Content-type', '.txt' );
	event.response.end( 'The file specified does not exist' );
	event.next();
};

/**
 * @brief	Adds a '/download' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/download', 'GET', ( event ) => {
	let file	= typeof event.queryStringObject.file === 'string'
				&& event.queryStringObject.file.length > 0
				? path.parse( event.queryStringObject.file )
				: false;

	if ( ! file )
	{
		downloadFailedCallback( event );
	}

	if ( ! fs.existsSync( event.queryStringObject.file ) )
	{
		downloadFailedCallback( event );
	}
	else
	{
		event.response.setHeader( 'Content-disposition', 'attachment; filename=' + file.base );
		event.response.setHeader( 'Content-type', file.ext );
		event.clearTimeout();

		try
		{
			let fStream	= fs.createReadStream( event.queryStringObject.file );
			fStream.pipe( event.response );
		}
		catch ( e )
		{
			downloadFailedCallback( event );
		}
	}
});

module.exports	= router;