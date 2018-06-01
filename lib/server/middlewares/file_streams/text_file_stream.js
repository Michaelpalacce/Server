'use strict';

// Dependencies
const FileStream	= require( './file_stream' );
const path			= require( 'path' );
const fs			= require( 'fs' );

/**
 * @brief	Used to stream text files
 */
class TextFileStream extends FileStream
{
	constructor( event )
	{
		super( event );
		// @TODO ADD MORE FORMATS
		this.SUPPORTED_FORMATS	= ['.txt', '.js', '.php', '.html', '.json', '.cpp', '.h', '.md', '.bat', '.log', '.yml'];
	}

	/**
	 * @brief	Returns whether this file stream supports the given file
	 *
	 * @param	String file
	 *
	 * @return	Boolean
	 */
	supports( file )
	{
		file	= path.parse( file );
		return this.SUPPORTED_FORMATS.indexOf( file.ext ) !== -1;
	}

	/**
	 * @brief	Streams the file given
	 *
	 * @param	String file
	 *
	 * @return	void
	 */
	stream( file )
	{
		if ( ! fs.existsSync( file ) )
		{
			this.event.setError( 'File not found' );
			return;
		}

		this.event.clearTimeout();

		file	= fs.createReadStream( file );

		file.pipe( this.event.response );
	}
}

module.exports	= TextFileStream;
