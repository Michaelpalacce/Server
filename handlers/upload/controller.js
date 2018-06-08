'use strict';

// Dependencies
const Server	= require( 'event_request' );
const fs		= require( 'fs' );
const path		= require( 'path' );

let router		= new Server.Router();

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


		event.body.files	= typeof event.body.files === 'object'
							? event.body.files
							: [];

		event.body.files.forEach( ( file ) =>{
			let oldPath	= file.path;
			let newPath	= path.join( directory, file.name );
			fs.rename( oldPath, newPath, () =>{
				event.redirect( '/browse?dir=' + encodeURIComponent( directory ) );
			});
		});

		if ( ! event.body.files.length > 0 )
		{
			event.sendError( 'Could not upload file', 500 );
		}
	}
});

// Export the module
module.exports	= router;
