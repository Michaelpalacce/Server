'use strict';

// Dependencies
const fs	= require( 'fs' );

// Define the object
let middlewaresContainer				= {};

const FORM_PARSER_SUPPORTED_TYPE		= 'application/x-www-form-urlencoded';
const MULTIPART_PARSER_SUPPORTED_TYPE	= 'multipart/form-data';

/**
 * @brief	Middleware responsible for parsing multipart data
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
middlewaresContainer.multipartParser	= ( event ) =>
{
	if ( event.headers['content-type'].split( ';' )[0] !== MULTIPART_PARSER_SUPPORTED_TYPE )
	{
		event.next();
		return;
	}

	event.once( 'payloadReceived', ( rawPayload ) => {
		event.body	= rawPayload;
		event.next();

		// let readStream	= fs.createReadStream( rawPayload );

		// // @TODO	IT's  miracle it works... now I just need to cut off the
		// // @TODO	extra data from the multipart upload
		// fs.writeFile( "movie.mp4", rawPayload,  "binary", function( err )
		//  {
		//     if(err) {
		//         console.log( err );
		//     } else {
		//         console.log( "The file was saved!" );
		//     }
		// 	event.next();
		// });
	});
};

/**
 * @brief	Middleware responsible for decoding form data passed
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
middlewaresContainer.formParser	= ( event ) =>
{
	if ( event.headers['content-type'] !== FORM_PARSER_SUPPORTED_TYPE )
	{
		event.next();
		return;
	}

	try
	{
		event.once( 'payloadReceived', ( rawPayload ) => {
			try
			{
				let decodedPayload	= decodeURIComponent( rawPayload.toString() );
				decodedPayload		= decodedPayload.split( '&' );
				event.body			= {};

				for ( let i = 0; i < decodedPayload.length; ++ i )
				{
					let param	= decodedPayload[i].split( '=' );

					if ( param.length !== 2 )
					{
						continue;
					}

					let key		= param[0];
					let value	= param[1];

					event.body[key]	= value;
				}

				event.next();
			}
			catch ( err )
			{
				event.setError( 'Error while parsing body.' )
			}
		});
	}
	catch ( error )
	{
		event.setError( 'Error while parsing body.' )
	}
};

/**
 * @brief	Parses the given cookies and sets them to event.cookies
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
middlewaresContainer.parseCookies	= ( event ) =>{
	var list = {},
        rc = event.headers.cookie;

    rc && rc.split( ';' ).forEach( function( cookie ) {
        var parts					= cookie.split( '=' );
        list[parts.shift().trim()]	= decodeURI( parts.join( '=' ) );
    });

    event.cookies	= list;
	event.next();
};

// Export the module
module.exports	= middlewaresContainer;
