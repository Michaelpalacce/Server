'use strict';

// Dependencies
const multipartDataParser	= require( './multipart_data_parser' );

// Define the object
let middlewaresContainer				= {};

/**
 * @brief	CONSTANTS
 */
const FORM_PARSER_SUPPORTED_TYPE		= 'application/x-www-form-urlencoded';
const MULTIPART_PARSER_SUPPORTED_TYPE	= 'multipart/form-data';

/**
 * @brief	Middleware responsible for parsing multipart data
 *
 * @param	Object options
 *
 * @return	Function
 */
middlewaresContainer.multipartParser	= ( options ) =>{
	return ( event ) =>
	{
		if (
			typeof event.headers['content-type'] === 'string'
			&& event.headers['content-type'].split( ';' )[0] === MULTIPART_PARSER_SUPPORTED_TYPE
		) {
			event.once( 'payloadReceived', ( rawPayload ) => {
				multipartDataParser.parse( event, rawPayload );
			});
		}
		else
		{
			event.next();
		}
	};
};

/**
 * @brief	Middleware responsible for decoding form data passed
 *
 * @param	Object options
 *
 * @return	Function
 */
middlewaresContainer.formParser	= ( options ) =>
{
	return ( event ) =>
	{
		if (
			typeof event.headers['content-type'] === 'string'
			&& event.headers['content-type'] === FORM_PARSER_SUPPORTED_TYPE
		) {
			try
			{
				console.log( 'yeah' );
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
		}
		else
		{
			event.next();
		}
	};
};

/**
 * @brief	Parses the given cookies and sets them to event.cookies
 *
 * @param	Object options
 *
 * @return	Function
 */
middlewaresContainer.parseCookies	= ( options ) =>
{
	return ( event ) =>{
		var list = {},
			rc = event.headers.cookie;

		rc && rc.split( ';' ).forEach( function( cookie ) {
			var parts					= cookie.split( '=' );
			list[parts.shift().trim()]	= decodeURI( parts.join( '=' ) );
		});

		event.cookies	= list;
		event.next();
	}
};

// Export the module
module.exports	= middlewaresContainer;
