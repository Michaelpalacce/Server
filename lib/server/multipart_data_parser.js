
// Dependencies
const fs			= require( 'fs' );
const stringHelper	= require( './../../handlers/main/utils/string_helper' );
const stream		= require( 'stream' );

const BOUNDARY_INDEX			= 0;
const CONTENT_DISPOSITION_INDEX	= 1;
const CONTENT_TYPE_INDEX		= 2;
const CONTENT_LENGTH_HEADER	= 'content-length';
const CONTENT_TYPE_HEADER	= 'content-type';
const BOUNDARY_REGEX		= /boundary=(\S+[^\s])/;

/**
 * @brief	Deletes a file and calls the callback when it's done
 *
 * @param	String file
 * @param	Function callback
 *
 * @return	void
 */
function deleteFile( file, callback )
{
	fs.unlink( file, ( err ) =>
	{
		if ( err )
			callback( err );

		callback( false )

	});
}

// @TODO DELETE
function getContentData( file )
{
	let fd			= fs.openSync( 'Uploads/' + file, 'r');
	let bufferSize	= 1024;
	let buffer		= Buffer.alloc( bufferSize );

	let leftOver	= '';
	let read, line, idxStart, idx, lineCount, newFileName, boundry, contentDisposition;
	lineCount	= 0;

	dataLoop:
		while ( ( read	= fs.readSync( fd, buffer, 0, bufferSize, null ) ) !== 0 )
		{
			leftOver	+= buffer.toString( 'utf8', 0, read );
			idxStart	= 0;
			while ( ( idx	= leftOver.indexOf( "\r\n", idxStart ) ) !== -1 )
			{
				line	= leftOver.substring( idxStart , idx );

				if ( lineCount === BOUNDARY_INDEX )
				{
					boundry	= line.trim();
				}
				else if ( lineCount === CONTENT_DISPOSITION_INDEX )
				{
					let filenameRegex	= new RegExp( 'filename="(\\S+)"' );
					contentDisposition	= line.trim();
					newFileName			= filenameRegex.exec( contentDisposition )[1];
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
		this.buffer				= Buffer.alloc( this.bufferSize );
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
			let readingBuffer	= Buffer.from( chunk );
			let cutHere			= 0;
			let leftOver		= '';
			let lineCount		= 0;
			let fileName		= '';

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

						if ( lineCount === 0 )
						{
							cutHere	+= line.length + 2;
						}
						else if ( lineCount === 1 )
						{
							cutHere	+= line.length + 2;

							let filenameRegex	= new RegExp( 'filename="(\\S+)"' );
							fileName			= filenameRegex.exec( line.trim() )[1];
						}
						else if ( lineCount === 2 )
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

			chunk	= chunk.slice( cutHere );
			chunk	= chunk.slice( 0, chunk.length - headerData.boundary.length - 8 );

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
		});
	}
}

// Export the module
module.exports	= FormParser;