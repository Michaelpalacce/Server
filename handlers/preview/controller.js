'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Adds a '/preview' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/preview', 'GET', ( event ) => {
	let file	= typeof event.queryStringObject.file === 'string'
				&& event.queryStringObject.file.length > 0
				? event.queryStringObject.file
				: false;

	if ( ! file )
	{
		event.setError( 'File does not exist' );
		return;
	}

	if ( ! fs.existsSync( file ) )
	{
		event.setError( 'File does not exist' );
	}
	else
	{
		event.render( 'preview', { src: '/video?file=' + file }, ( err )=>{
			if ( err )
			{
				event.setError( err );
			}
		});
	}
});

/**
 * @brief	Adds a '/video' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/video', 'GET', ( event ) =>{
	let file	= typeof event.queryStringObject.file === 'string'
	&& event.queryStringObject.file.length > 0
		? event.queryStringObject.file
		: false;

	if ( ! file )
	{
		event.setError( 'File does not exist' );
		return;
	}

	if ( ! fs.existsSync( file ) )
	{
		event.setError( 'File does not exist' );
	}
	else
	{
		event.streamFile( file );
	}
});

module.exports	= router;
