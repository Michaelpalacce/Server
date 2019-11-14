'use strict';

// Dependencies
const { Server, Development }	= require( 'event_request' );
const fs						= require( 'fs' );
const { FileStream }			= Development;
const PathHelper				= require( './../main/path' );

let router			= Server().Router();

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
		let file			= typeof event.queryString.file === 'string'
							&& event.queryString.file.length > 0
							? event.queryString.file
							: false;

		const fileStream	= PathHelper.getFileStreamerForFile( event, file );

		if ( ! file || ! fs.existsSync( file ) || fileStream === null )
		{
			event.sendError( 'File does not exist', 400 );
		}
		else
		{
			event.render( 'preview', { type: fileStream.getType(), src: '/data?file=' + encodeURIComponent( file ) }, event.next );
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
			event.next( 'File does not exist' );
		}
		else
		{
			event.streamFile( file );
		}
	}
});

module.exports	= router;
