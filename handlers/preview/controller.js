'use strict';

// Dependencies
const Server	= require( 'event_request' );
const fs		= require( 'fs' );
const path		= require( 'path' );

let router		= new Server.Router();

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
			let fileStats	= path.parse( file );
			event.render( 'preview', { type: fileStats.ext, src: '/data?file=' + file }, ( err )=>{
				if ( err )
				{
					event.setError( 'Could not render template' );
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
			event.streamFile( file );
		}
	}
});

module.exports	= router;
