'use strict';

// Dependencies
const fs		= require( 'fs' );
const stream	= require( 'stream' );
const os		= require('os');

const BOUNDARY_INDEX				= 0;
const CONTENT_DISPOSITION_INDEX		= 1;
const CONTENT_TYPE_INDEX			= 2;
const CONTENT_LENGTH_HEADER			= 'content-length';
const CONTENT_TYPE_HEADER			= 'content-type';
const BOUNDARY_REGEX				= /boundary=(\S+[^\s])/;
const BUFFER_REDUNDANCY				= 70;
const SYSTEM_EOL_LENGTH				= os.EOL.length;
const REDUNDANT_EMPTY_LINE_LENGTH	= SYSTEM_EOL_LENGTH;

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
		this.uploadDirectory	= options.uploadDirectory || 'Uploads/';
		this.saveToFolder		= options.saveToFolder || false;
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
				let bufferString	= read.toString( 'utf8' );
				// match for beginnings
				let boundaryRegex	= new RegExp(  '--' + headerData.boundary, 'gm' );

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
		let readingBuffer	= Buffer.from( chunks[0] );
			let cutHere			= 0;
			let lineCount		= 0;
			let leftOver		= '';
			let fileName		= '';
			let error			= false;
			let read, line, idxStart, idx;

			let currentPosition	= 0;

			dataLoop:
				while ( ( read	= readingBuffer.slice( currentPosition, this.bufferSize ) ) !== null )
				{
					leftOver	+= read.toString( 'utf8' );
					idxStart	= 0;
					while ( ( idx	= leftOver.indexOf( "\r\n", idxStart ) ) !== -1 )
					{
						line	= leftOver.substring( idxStart, idx );

						if ( lineCount === BOUNDARY_INDEX )
						{
							if ( line.match( headerData.boundary ) === null )
							{
								error	= 'Boundary does not match.';
								break dataLoop;
							}
							cutHere	+= line.length + 2;
						}
						else if ( lineCount === CONTENT_DISPOSITION_INDEX )
						{
							cutHere		+= line.length + 2;
							line		= line.trim();
							line		= line.match( /filename="([\S\s]+)"/ );

							if ( line === null )
							{
								error	= 'File name not specified';
								break dataLoop;
							}

							fileName	= line[1];
						}
						else if ( lineCount === CONTENT_TYPE_INDEX )
						{
							cutHere	+= line.length + 2;
						}
						else if ( lineCount === 3 )
						{
						}
						else
						{
							break dataLoop;
						}

						idxStart	= idx + 1;
						++lineCount;
					}

					leftOver	= leftOver.substring( idxStart );
				}

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
			let chunks		= this.separateChunks( chunk, headerData );
			let chunkData	= this.extractChunkDataFromChunks( chunks );
event.redirect( '/browse' );
return ;
			if ( typeof event.extra.files !== 'object' )
			{
				event.extra.files	= [];
			}

console.log(chunks);
			//@TODO TEMP
			let file	= chunks[0];
			event.extra.files.push({
				filename	: file.filename,
				fileBuffer	: file.chunk,
				fileLength	: file.chunk.length
			});

			if ( this.saveToFolder )
			{
				fs.writeFile( this.uploadDirectory + fileName, chunk , 'binary', ( err ) => {
					if ( err )
					{
						event.setError( err );
					}
					else
					{
						event.next();
					}
				});
			}
			else
			{
				event.next();
			}
		});
	}
}

// Export the module
module.exports	= FormParser;
