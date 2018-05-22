'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Adds a '/upload' route with method POST
 *
 * @TODO    Implement this! Do some extra research!
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/upload', 'POST', ( event ) => {
	event.next();
	// let dir	= typeof event.queryStringObject.dir === 'string'
	// 		&& event.queryStringObject.dir.length > 0
	// 		? event.queryStringObject.dir
	// 		: false;
	//
	// if ( ! dir )
	// {
	// 	event.setError( 'Dir is incorrect' );
	// 	return;
	// }

	// let file	= event.payload.split( '\r\n' );
	// file.splice( 0, 1 );
	// let contentDisposition	= file.splice( 0, 1 )[0];
	// file.splice( 0, 1 );
	// file.splice( 0, 1 );
	// file	= file.join( '\r\n' );
	// // console.log(file);
	//
	// //@TODO REFACTOR THIS STUFF
	// let fileData	= contentDisposition.split( ':' )[1].split( ';' )
	// let filename	= 'file';
	// for ( let i = 0; i < fileData.length; ++ i )
	// {
	// 	let data	= fileData[i].split( '=' );
	// 	if ( data[0].trim() === 'filename' )
	// 	{
	// 		filename	= data[1].trim();
	// 		filename	= filename.replace( /"/g, '' );
	// 	}
	// }
	// filename	= __dirname + '/../../Uploads/' + filename;
	//
	// fs.writeFile( filename, file, ( err ) => {
	// 	if ( err )
	// 	{
	// 		event.setError( err );
	// 	}
	//
	// 	event.next();
	// });
});

// Export the module
module.exports	= router;
