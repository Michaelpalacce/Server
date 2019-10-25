'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const path			= require( 'path' );

let router			= Server().Router();

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
		let result	= event.validationHandler.validate( event.body, { directory : 'filled||string', files : 'filled' } );

		if ( ! ! result.hasValidationFailed() )
		{
			event.next( 'Could not upload one or more files', 400 );
			return;
		}
		result			= result.getValidationResult();

		let directory	= decodeURIComponent( result.directory );
		let files		= result.files;

		files.forEach( ( file ) =>{
			let oldPath		= file.path;
			let fileName	= path.parse( file.name );
			fileName		= fileName.name + fileName.ext;
			let newPath		= path.join( directory, fileName );
			fs.rename( oldPath, newPath, () =>{
				event.send( 'ok' );
			});
		});
	}
});

// Export the module
module.exports	= router;
