'use strict';

// Dependencies
const { Server }			= require( 'event_request' );
const fs					= require( 'fs' );
const { promisify }			= require( 'util' );
const path					= require( 'path' );
const UploadInput			= require( '../input/upload_input' );

const rename				= promisify( fs.rename );

const app					= Server();
const AJAX_HEADER			= 'x-requested-with';
const AJAX_HEADER_VALUE		= 'XMLHttpRequest';


/**
 * @brief	Adds a '/file' route with method POST
 *
 * @details	Saves the file async
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/file', ( event ) => {
		const input	= new UploadInput( event );

		if ( ! input.isValid() )
		{
			return event.next( 'Could not upload one or more files', 400 );
		}

		const directory	= input.getDirectory();
		const files		= input.getFiles();

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
					// Attempt to stream file to new location in case of virtualization ( may fail and used as last resort )
					if ( typeof error !== 'undefined' && typeof error.code !== 'undefined' && error.code === 'EXDEV' )
					{
						const readableStream	= fs.createReadStream( oldPath );
						readableStream.pipe( fs.createWriteStream( newPath ) );

						readableStream.on( 'end', resolve );
						readableStream.on( 'error', reject );

						return;
					}

					console.log(error)
					reject( error );
				} );
			} ).catch( event.next ) );
		});

		Promise.all( promises ).then( ()=>{
			if ( typeof event.headers[AJAX_HEADER] === 'string' && event.headers[AJAX_HEADER] === AJAX_HEADER_VALUE )
			{
				return event.send( ['ok'], 201 );
			}

			event.redirect( '/browse?dir='+  encodeURIComponent( directory ) );
		}).catch( event.next );
	}
);
