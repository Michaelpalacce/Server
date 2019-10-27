'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );
const path			= require( 'path' );

const router			= Server().Router();
const AJAX_HEADER		= 'x-requested-with';
const AJAX_HEADER_VALUE	= 'XMLHttpRequest';


/**
 * @brief	Adds a '/create/folder' route with method POST
 *
 * @details	Creates a new folder
 *
 * @details	Required Parameters: directory
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/create/folder',
	method	: 'POST',
	handler	: ( event ) => {
		let result	= event.validationHandler.validate( event.body, { folder : 'filled||string' } );

		if ( ! ! result.hasValidationFailed() )
		{
			event.next( 'Invalid folder given', 400 );
			return;
		}
		result			= result.getValidationResult();

		const folder	= decodeURIComponent( result.folder );

		if ( ! fs.existsSync( folder ) )
		{
			fs.mkdirSync( folder );
			event.send( ['ok'] );
		}
		else
		{
			event.sendError( 'Directory already exists' );
		}
	}
});

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
		let filesDone	= 0;

		files.forEach( ( file ) =>{
			let oldPath		= file.path;
			let fileName	= path.parse( file.name );
			let newPath		= path.join( directory, fileName.dir, fileName.name + fileName.ext );
			let fileStats	= path.parse( newPath );

			if ( ! fs.existsSync( fileStats.dir ) )
			{
				fs.mkdirSync( fileStats.dir, { recursive: true } );
			}

			fs.rename( oldPath, newPath, ()=>{
				++filesDone;
			} );
		});

		let tries		= 0;
		const interval	= setInterval( ()=>{
			tries++;

			if ( tries >= 10 )
			{
				clearInterval( interval );
				event.sendError( 'ERROR WHILE UPLOADING FILES' );
				return;
			}

			if ( files.length === filesDone )
			{
				clearInterval( interval );
				if ( typeof event.headers[AJAX_HEADER] === 'string' && event.headers[AJAX_HEADER] === AJAX_HEADER_VALUE )
				{
					event.send( ['ok'] );
					return;
				}

				event.redirect( '/browse?dir='+  encodeURIComponent( directory ) );
			}
		}, 1000 );
	}
});

// Export the module
module.exports	= router;
