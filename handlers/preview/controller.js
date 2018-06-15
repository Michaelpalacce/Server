'use strict';

// Dependencies
const { Router }	= require( 'event_request' );
const fs			= require( 'fs' );
const path			= require( 'path' );

let router			= new Router();

/**
 * @brief	Adds a '/preview' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/preview',
	method	: 'GET',
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
			let fileStats	= path.parse( file );
			event.render( 'preview', { type: fileStats.ext, src: '/data?file=' + encodeURIComponent( file ) }, ( err )=>{
				if ( err )
				{
					event.sendError( 'Could not render template' );
				}
			});
		}
	}
});

/**
 * @brief	Adds a '/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/data',
	method	: 'GET',
	handler	: ( event ) =>{
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
			event.streamFile( file );
		}
	}
});

module.exports	= router;
