
// Dependencies
const fs	        = require( 'fs' );
const stringHelper	= require( './../../handlers/main/utils/string_helper' );

// Define the container
var multipartParser	= {};

multipartParser.parse	= ( event, rawPayload ) => {


	let tempFileName	= stringHelper.makeId( 10 );

	fs.writeFile( 'Uploads/' + tempFileName, rawPayload,  "binary", function( err )
	{
		if( err )
		{
			console.log( err );
		}
		else
		{
			let fd			= fs.openSync( 'Uploads/' + tempFileName, 'r');
			let bufferSize	= 1024;
			let buffer		= Buffer.alloc( bufferSize );

			let leftOver	= '';
			let read, line, idxStart, idx, lineCount, newFilePointer, newFileName, boundry, contentDisposition;
			lineCount	= 0;

			bigMamaLoop:
				while ( ( read	= fs.readSync( fd, buffer, 0, bufferSize, null ) ) !== 0 )
				{
					leftOver	+= buffer.toString( 'utf8', 0, read );
					idxStart	= 0;
					while ( ( idx	= leftOver.indexOf( "\r\n", idxStart ) ) !== -1 )
					{
						line	= leftOver.substring( idxStart + 1, idx );

						if ( lineCount === 0 )
						{
							boundry	= line.trim();
						}
						else if ( lineCount === 1 )
						{
							let filenameRegex	= new RegExp( 'filename="(\\S+)"' );
							contentDisposition	= line.trim();
							newFileName			= filenameRegex.exec( contentDisposition )[1];
							newFilePointer		= fs.createWriteStream( 'Uploads/' + newFileName );
						}
						else if ( lineCount === 2 || lineCount === 3 )
						{
						}
						else if ( line.search( boundry ) !== -1 )
						{
							newFilePointer.end();
							break bigMamaLoop;
						}
						else
						{
							if ( lineCount === 4 )
							{
								line.trim();
							}

							newFilePointer.write( line );
						}

						idxStart	= idx + 1;
						++lineCount;
					}

					leftOver	= leftOver.substring( idxStart );
				}
			event.next();
			// fs.unlink( 'Uploads/' + tempFileName, ( err ) =>
			// {
			// 	console.log( err );
			// 	if ( err )
			// 		event.serverError( err );
			//
			// 	event.next();
			//
			// });
		}
	});
};


// Export the module
module.exports	= multipartParser;