'use strict';

// Dependencies
const { Router }	= require( 'event_request' );
const fs			= require( 'fs' );
const path			= require( 'path' );

let router			= new Router();

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
router.add({
	route	: '/upload',
	method	: 'POST',
	handler	: ( event ) => {
		let directory	= typeof event.body.directory === 'string'
						? event.body.directory
						: '/';

		let files		= typeof event.body.files === 'object'
						? event.body.files
						: false;

		if ( ! files )
		{
			event.next( 'Could not upload file', 500 );
		}

		files.forEach( ( file ) =>{
			let oldPath	= file.path;
			let newPath	= path.join( directory, file.name );
			fs.rename( oldPath, newPath, () =>{
				event.redirect( '/browse?dir=' + encodeURIComponent( directory ) );
			});
		});
	}
});

// Export the module
module.exports	= router;
