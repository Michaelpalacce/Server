'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const fs		= require( 'fs' );

let router		= new Router();

/**
 * @brief	Adds a '/upload' route with method POST
 *
 * @details	Saves the file async
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/upload', 'POST', ( event ) => {
	if ( typeof event.extra.files !== 'object' )
	{
		event.setError( 'No files were processed' );
	}

	let files	= event.extra.files;

	for ( let index in files )
	{
		let file	= files[index];
		fs.writeFile( 'Uploads/' + file.filename, file.fileBuffer , 'binary', ( err ) => {
			if ( err )
			{
				console.log( err );
			}

			console.log( 'file written' );
		});
	}

	event.redirect( '/' );
});

// Export the module
module.exports	= router;
