'use strict';

// Dependencies
const fs				= require( 'fs' );

/**
 * @brief	File streamer used to stream files
 *
 * @TODO	THIS needs to be changed a lot...
 */
class FileStreamer
{
	/**
	 * @param	RequestEvent event
	 * @param	Object options
	 */
	constructor( event, options )
	{
		this.event	= event;
	}

	/**
	 * @brief	Check if given file is supported to be streamed
	 *
	 * @param	String file
	 *
	 * @return	Boolean
	 */
	supports( file )
	{
	}

	/**
	 * @brief	Gets the file streamer responsible for handling the given file type
	 *
	 * @details	Returns null if a file streamer is not found
	 *
	 * @param	String file
	 *
	 * @return	NULL
	 */
	getFileStreamerForType( file )
	{
	}

	/**
	 * @brief	Streams the file given
	 *
	 * @TODO	Integrate Buffer support, file descriptor support and normal path support
	 *
	 * @param	String file
	 *
	 * @return	void
	 */
	stream( file )
	{
		let stat		= fs.statSync( file );
		let fileSize	= stat.size;
		let range		= this.event.headers.range;

		this.event.clearTimeout();
		if ( range )
		{
			let parts		= range.replace( /bytes=/, "" ).split( "-" );
			let start		= parseInt( parts[0], 10 );
			let end			= parts[1]
				? parseInt(parts[1], 10)
				: fileSize-1;

			file			= fs.createReadStream( file, { start, end } );

			this.event.setHeader( 'Content-Range', `bytes ${start}-${end}/${fileSize}` );
			this.event.setHeader( 'Accept-Ranges', 'bytes' );
			this.event.setHeader( 'Content-Length', ( end - start ) + 1 );
			this.event.setHeader( 'Content-Type', 'video/mp4' );
			this.event.response.statusCode	= 206;

			file.pipe( this.event.response );
		}
		else
		{
			this.event.setHeader( 'Content-Length', fileSize );
			this.event.setHeader( 'Content-Type', 'video/mp4' );
			this.event.response.statusCode	= 200;

			file	= fs.createReadStream( file );
			file.pipe( this.event.response );
		}
	}
}

module.exports	= FileStreamer;