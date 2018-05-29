'use strict';

// Dependencies
const os		= require('os');

/**
 * @brief	Constants
 */
const CONTENT_DISPOSITION_INDEX				= 0;
const CONTENT_TYPE_INDEX					= 1;
const CONTENT_LENGTH_HEADER					= 'content-length';
const CONTENT_TYPE_HEADER					= 'content-type';
const BOUNDARY_REGEX						= /boundary=(\S+[^\s])/;
const CONTENT_DISPOSITION_NAME_REGEX		= /\bname="(.+)"/;
const CONTENT_DISPOSITION_FILENAME_REGEX	= /\bfilename="(.+)"/;
const BUFFER_REDUNDANCY						= 70;
const SYSTEM_EOL							= os.EOL;
const SYSTEM_EOL_LENGTH						= SYSTEM_EOL.length;
const REDUNDANT_EMPTY_LINE_LENGTH			= SYSTEM_EOL_LENGTH;
const DEFAULT_BUFFER_ENCODING				= 'ascii';
const DEFAULT_BOUNDARY_PREFIX				= '--';
const DEFAULT_BUFFER_SIZE					= 5242880; // 5 MB

/**
 * @brief	FormParser used to parse multipart data
 */
class MultipartFormParser
{
	constructor( options )
	{
		this.bufferSize	= options.BufferSize || DEFAULT_BUFFER_SIZE;
		this.buffer		= Buffer.alloc( this.bufferSize );
	}

	/**
	 * @brief	Get header data from event
	 *
	 * @details	Will return false on error
	 *
	 * @param	Object headers
	 *
	 * @return	Object|Boolean
	 */
	getHeaderData( headers )
	{
		let contentType		= typeof headers[CONTENT_TYPE_HEADER] === 'string'
							? headers[CONTENT_TYPE_HEADER]
							: false;
		let contentLength	= typeof headers[CONTENT_LENGTH_HEADER] === 'string'
							? parseInt( headers[CONTENT_LENGTH_HEADER] )
		 					: false;

		if ( contentType === false || contentLength === false )
		{
			return false;
		}

		let boundary	= contentType.match( BOUNDARY_REGEX );

		if ( boundary === null )
		{
			return false;
		}

		return {
			length		: contentLength,
			boundary	: boundary[1]
		}
	}

	/**
	 * @brief	Separate the payload given in boundary chunks
	 *
	 * @param	Buffer chunk
	 * @param	Object headerData
	 *
	 * @return	Object
	 */
	separateChunks( chunk, headerData )
	{
		let currentPosition	= 0;
		let parts			= [];
		let read;

		while (
			read = chunk.slice( currentPosition, currentPosition + this.bufferSize + BUFFER_REDUNDANCY ),
			read.length !== 0
		) {
			let bufferString	= read.toString( DEFAULT_BUFFER_ENCODING );
			// regex for boundaries
			let boundaryRegex	= new RegExp( DEFAULT_BOUNDARY_PREFIX + headerData.boundary, 'g' );

			bufferString.replace( boundaryRegex, ( match, offset, string )=>{
				// Skip in this case since it will be handled by the next buffer seek
				if ( offset > this.bufferSize )
					return ;

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

		for ( let index in chunks )
		{
			let chunk					= chunks[index];
			let lineCount				= 0;
			let currentPosition			= 0;
			let leftOver				= '';
			let contentTypeLine			= '';
			let contentDispositionLine	= '';
			let read, line, idxStart, idx;

			// Loop just in case but it should not have to loop more than once
			dataLoop:
				while ( ( read	= chunk.slice( currentPosition, 5242880 ) ), read.length !== 0 )
				{
					leftOver	+= read.toString( DEFAULT_BUFFER_ENCODING );
					idxStart	= 0;

					// Ideally should not happen
					if ( idx = leftOver.indexOf( SYSTEM_EOL, idxStart ) === -1 )
					{
						break;
					}

					while ( ( idx = leftOver.indexOf( SYSTEM_EOL, idxStart ) ) !== -1 )
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

			let metadataToRemove	= contentDispositionLine.length + SYSTEM_EOL_LENGTH;

			if ( contentTypeLine.length !== 0 )
			{
				// metadata to remove in case of a file upload
				metadataToRemove	+= contentTypeLine.length + SYSTEM_EOL_LENGTH + REDUNDANT_EMPTY_LINE_LENGTH;
			}
			else
			{
				// Metadata to remove in case of a multipart form param
				metadataToRemove	+= REDUNDANT_EMPTY_LINE_LENGTH;
			}

			let filename	= contentDispositionLine.match( CONTENT_DISPOSITION_FILENAME_REGEX );
			let name		= contentDispositionLine.match( CONTENT_DISPOSITION_NAME_REGEX );
			filename		= filename === null ? filename : filename[1];
			name			= name === null ? name : name[1];

			if ( filename !== null && name !== null )
			{
				// File input being parsed
				chunkData.files.push({
					filename	: filename,
					chunk		: chunk.slice( metadataToRemove )
				});
			}
			else if ( name !== null )
			{
				// Multipart form param being parsed
				chunkData.bodyData[name]	= chunk.slice( metadataToRemove ).toString();
			}
		}

		return chunkData;
	}

	/**
	 * @brief	Parse the payload
	 *
	 * @param	Object headers
	 * @param	Buffer rawPayload
	 * @param	Function callback
	 *
	 * @return	void
	 */
	parse( headers, rawPayload, callback )
	{
		let headerData;

		if ( ! ( headerData = this.getHeaderData( headers ) ) )
		{
			callback( 'Could not retrieve the header data' );
		}

		if ( rawPayload.length === headerData.length )
		{
			let chunks		= this.separateChunks( rawPayload, headerData );
			if ( chunks.length === 0 )
			{
				callback( 'No chunks found' );
			}
			else
			{
				let chunkData	= this.extractChunkDataFromChunks( chunks );
				callback( false, chunkData.bodyData, chunkData.files );
			}
		}
		else
		{
			callback( 'Provided content-length did not match payload length' );
		}
	}
}

// Export the module
module.exports	= MultipartFormParser;
