'use strict';

// Dependencies
const { Server }		= require( 'event_request' );
const fs				= require( 'fs' );
const { promisify }		= require( 'util' );
const path				= require( 'path' );
const rename			= promisify( fs.rename );

const router			= Server().Router();
const AJAX_HEADER		= 'x-requested-with';
const AJAX_HEADER_VALUE	= 'XMLHttpRequest';

const FORBIDDEN_CHARACTERS	= [ '<', '>', ':', '|', '?', '*' ];

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
router.post( '/create/folder', ( event ) => {
		let result	= event.validationHandler.validate( event.body, { folder : 'filled||string' } );

		if ( ! ! result.hasValidationFailed() )
		{
			event.next( 'Invalid folder given', 400 );
			return;
		}
		result			= result.getValidationResult();

		const folder	= decodeURIComponent( result.folder );

		for ( const charIndex in FORBIDDEN_CHARACTERS )
		{
			const character	= FORBIDDEN_CHARACTERS[charIndex];
			if ( folder.includes( character ) )
			{
				event.sendError( 'Folder name contains invalid characters' );
				return;
			}
		}

		if ( ! fs.existsSync( folder ) || folder === '/' )
		{
			try
			{
				fs.mkdirSync( folder );
				event.send( ['ok'] );
			}
			catch ( e )
			{
				event.sendError( 'Could not create folder' );
			}
		}
		else
		{
			event.sendError( 'Directory already exists' );
		}
	}
);

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
router.post( '/upload', ( event ) => {
		let result	= event.validationHandler.validate( event.body, { directory : 'filled||string', $files : 'filled' } );

		if ( ! ! result.hasValidationFailed() )
		{
			event.next( 'Could not upload one or more files', 400 );
			return;
		}
		result			= result.getValidationResult();

		const directory	= decodeURIComponent( result.directory );
		const files		= result.$files;

		const promises	= [];

		files.forEach( ( file ) =>{
			promises.push( new Promise( async ( resolve, reject )=>{
				const oldPath	= file.path;
				const fileName	= path.parse( file.name );

				let newPath		= path.join( directory, fileName.dir );
				newPath			= path.join( newPath, fileName.name + fileName.ext );

				const fileStats	= path.parse( newPath );

				if ( ! fs.existsSync( fileStats.dir ) )
				{
					fs.mkdirSync( fileStats.dir, { recursive: true } );
				}
				event.clearTimeout();

				rename( oldPath, newPath ).then( resolve ).catch( ( error )=>{
					// Attempt to stream file to new location in case of virtualization ( may fail )
					if ( typeof error !== 'undefined' && typeof error.code !== 'undefined' && error.code === 'EXDEV' )
					{
						const readableStream	= fs.createReadStream( oldPath );
						readableStream.pipe( fs.createWriteStream( newPath ) );

						readableStream.on( 'end', resolve );
						readableStream.on( 'error', reject );

						return;
					}

					reject( error );
				} );
			} ).catch( event.next ) );
		});

		Promise.all( promises ).then( ()=>{
			if ( typeof event.headers[AJAX_HEADER] === 'string' && event.headers[AJAX_HEADER] === AJAX_HEADER_VALUE )
			{
				return event.send( ['ok'] );
			}

			event.redirect( '/browse?dir='+  encodeURIComponent( directory ) );
		}).catch( event.next );

	}
);

// Export the module
module.exports	= router;
