'use strict';

// Dependencies
const app					= require( 'event_request' )();
const fs					= require( 'fs' );
const { promisify }			= require( 'util' );
const path					= require( 'path' );
const UploadInput			= require( '../input/upload_input' );

const rename				= promisify( fs.rename );

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
app.post( '/file', async ( event ) => {
		const input	= new UploadInput( event );

		if ( ! input.isValid() )
			return event.next( `Could not upload one or more files: ${input.getReasonToString()}`, 400 );

		const directory	= input.getDirectory();
		const files		= input.getFiles();

		const promises	= [];

		for ( const file of files )
		{
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

			await rename( oldPath, newPath );
		}

		Promise.all( promises ).then( ()=>{
			if ( typeof event.headers[AJAX_HEADER] === 'string' && event.headers[AJAX_HEADER] === AJAX_HEADER_VALUE )
				return event.send( ['ok'], 201 );

			event.redirect( `/browse?dir=${encodeURIComponent( Buffer.from( directory ).toString( 'base64' ) )}` );
		}).catch( event.next );
	}
);
