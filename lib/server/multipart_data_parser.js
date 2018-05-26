'use strict';

// Dependencies
const fs		= require( 'fs' );
const stream	= require( 'stream' );
const os		= require('os');

const CONTENT_DISPOSITION_INDEX				= 0;
const CONTENT_TYPE_INDEX					= 1;
const CONTENT_LENGTH_HEADER					= 'content-length';
const CONTENT_TYPE_HEADER					= 'content-type';
const BOUNDARY_REGEX						= /boundary=(\S+[^\s])/;
const CONTENT_DISPOSITION_NAME_REGEX		= /\bname="(\S+)"/;
const CONTENT_DISPOSITION_FILENAME_REGEX	= /\bfilename="(\S+)"/;
const BUFFER_REDUNDANCY						= 70;
const SYSTEM_EOL_LENGTH						= os.EOL.length;
const REDUNDANT_EMPTY_LINE_LENGTH			= SYSTEM_EOL_LENGTH;

/**
 * @brief	Get header data from event
 *
 * @param	RequestEvent event
 *
 * @return	Object
 */
function getHeaderData( event )
{
	let contentType	= event.headers[CONTENT_TYPE_HEADER];
	contentType		= contentType.split( ';');

	if ( contentType.length !== 2 )
	{
		return false;
	}

	return {
		length		: event.headers[CONTENT_LENGTH_HEADER],
		boundary	: contentType[1].match( BOUNDARY_REGEX )[1]
	}
}

/**
 * @brief	FormParser used to parse multipart data
 */
class FormParser
{
	constructor( options )
	{
		this.bufferSize			= options.BufferSize || 1024;
		this.buffer				= Buffer.alloc( this.bufferSize );
	}

	separateChunks( chunk, headerData )
	{
		let error			= false;
		let currentPosition	= 0;
		let read			= null;
		let parts			= [];

		dataLoop:
			while (
				read = chunk.slice( currentPosition, currentPosition + this.bufferSize + BUFFER_REDUNDANCY ),
				read.length !== 0
			) {
				let bufferString	= read.toString( 'ascii' );
				// match for beginnings
				let boundaryRegex	= new RegExp(  '--' + headerData.boundary, 'g' );

				bufferString.replace( boundaryRegex, ( match, offset, string )=>{
					// Skip in this case since it will be handled by the next buffer seek
					if ( offset > this.bufferSize )
					{
						return ;
					}


					parts.push( currentPosition + offset );
				});

				currentPosition		+= this.bufferSize;
			}

		let chunks	= [];

		for ( let i = 0; i < parts.length; ++ i )
		{
			if ( ( i + 1 ) !== parts.length )
			{
				let currentPart		= parts[i];
				let nextPart		= parts[i + 1];
				chunks.push( chunk.slice(
					currentPart + headerData.boundary.length + SYSTEM_EOL_LENGTH + REDUNDANT_EMPTY_LINE_LENGTH,
					nextPart - REDUNDANT_EMPTY_LINE_LENGTH
				));
			}
		}

		return chunks;
	}

	extractChunkDataFromChunks( chunks )
	{
		let chunkData	= {
			files		: [],
			bodyData	: {}
		};

		for ( var index in chunks )
		{
			let chunk					= chunks[index];
			let currentChunkData		= {};
			let lineCount				= 0;
			let leftOver				= '';
			let currentPosition			= 0;
			let contentTypeLine			= '';
			let contentDispositionLine	= '';
			let read, line, idxStart, idx;

			dataLoop:
				while ( ( read	= chunk.slice( currentPosition, 5242880 ) ), read.length !== 0 )
				{
					leftOver	+= read.toString( 'ascii' );
					idxStart	= 0;


					if ( idx = leftOver.indexOf( "\r\n", idxStart ) === -1 )
					{
						break;
					}

					while ( ( idx = leftOver.indexOf( "\r\n", idxStart ) ) !== -1 )
					{
						line	= leftOver.substring( idxStart, idx );

						if ( lineCount === CONTENT_DISPOSITION_INDEX )
						{
							contentDispositionLine	= line;
						}
						else if ( lineCount === CONTENT_TYPE_INDEX )
						{
							contentTypeLine	= line
						}
						else
						{
							break dataLoop;
						}

						idxStart	= idx + SYSTEM_EOL_LENGTH;
						++ lineCount;
					}

					leftOver	= leftOver.substring( idxStart );
				}

			let metadataToRemove		= contentDispositionLine.length + SYSTEM_EOL_LENGTH;

			if ( contentTypeLine.length !== 0 )
			{
				metadataToRemove	+= contentTypeLine.length + SYSTEM_EOL_LENGTH + REDUNDANT_EMPTY_LINE_LENGTH;
			}
			else
			{
				metadataToRemove	+= REDUNDANT_EMPTY_LINE_LENGTH;
			}

			let filename	= contentDispositionLine.match( CONTENT_DISPOSITION_FILENAME_REGEX );
			filename		= filename === null ? false : filename[1];
			let name		= contentDispositionLine.match( CONTENT_DISPOSITION_NAME_REGEX );
			name			= name === null ? false : name[1];

			if ( filename !== false && name !== false )
			{
				chunkData.files.push({
					filename	: filename,
					chunk		: chunk.slice( metadataToRemove )
				});
			}
			else if ( name !== false )
			{
				chunkData.bodyData[name]	= chunk.slice( metadataToRemove ).toString();
			}
		}

		return chunkData;
	}

	/**
	 * @brief	Parse the payload
	 *
	 * @param	RequestEvent event
	 * @param	Buffer rawPayload
	 *
	 * @return	void
	 */
	parse( event, rawPayload )
	{
		let headerData	= {};

		if ( ! ( headerData = getHeaderData( event ) ) )
		{
			event.setError( 'Could not retrieve the header data' );
		}
		let readStream	= new stream.PassThrough();
		readStream.end( rawPayload );

		readStream.on( 'data', ( chunk ) => {

			// fs.writeFileSync( 'test', chunk, 'binary' )
			// return;
			let chunks		= this.separateChunks( chunk, headerData );
			let chunkData	= this.extractChunkDataFromChunks( chunks );

			if ( typeof event.extra.files !== 'object' )
			{
				event.extra.files	= [];
			}

			if ( typeof event.body !== 'object' )
			{
				event.body	= {};
			}

			event.extra.files	= chunkData.files;
			event.body			= chunkData.bodyData;
			event.next();
		});
	}
}

// Export the module
module.exports	= FormParser;
