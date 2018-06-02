'use strict';

// Dependencies
const FileStream		= require( './file_streams/file_stream' );
const Mp4FileStream		= require( './file_streams/mp4_file_stream' );
const TextFileStream	= require( './file_streams/text_file_stream' );

/**
 * @brief	File streamer used to stream files
 */
class FileStreamHandler
{
	/**
	 * @param	RequestEvent event
	 * @param	Object options
	 *
	 * @TODO	ADD OPTIONS like body_parser.js
	 */
	constructor( event, options )
	{
		this.event			= event;
		this.fileStreams	= [];
		this.initStreams();
	}

	/**
	 * @brief	Initializes the file stream handler and adds all supported file streams
	 *
	 * @return	void
	 */
	initStreams()
	{
		let mp4FileStream	= new Mp4FileStream( this.event );
		let textFileStream	= new TextFileStream( this.event );

		this.fileStreams.push( mp4FileStream );
		this.fileStreams.push( textFileStream );
	}

	/**
	 * @brief	Get all supported file types from the added file streams
	 *
	 * @return	Array
	 */
	getSupportedTypes()
	{
		let formats	= [];
		for ( let index in this.fileStreams )
		{
			let fileStream  = this.fileStreams[index];
			formats	= formats.concat( fileStream.SUPPORTED_FORMATS );
		}

		return formats;
	}

	/**
	 * @brief	Gets the file streamer responsible for handling the given file type
	 *
	 * @details	Returns null if a file streamer is not found
	 *
	 * @param	String file
	 *
	 * @return	FileStream
	 */
	getFileStreamerForType( file )
	{
		for ( let index in this.fileStreams )
		{
			let fileStream  = this.fileStreams[index];
			if ( fileStream.supports( file ) )
			{
				return fileStream;
			}
		}

		return null;
	}
}

module.exports	= FileStreamHandler;