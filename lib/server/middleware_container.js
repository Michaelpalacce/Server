'use strict';

// Dependencies
const FormParser	= require( './multipart_data_parser' );
const fs			= require( 'fs' );
const path			= require( 'path' );
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
 * 			Accepts options:
 * 			- BufferSize - The size of the buffer when reading
 * 			( smaller means slower but more memory efficient)
 * 			- uploadDirectory - the folder to upload to
 * 			- saveToFolder - wether the file should be saved to the folder or
 * 			 just passed to the event.extra.files
 *
 * @return	Array
 */
middlewaresContainer.multipartParser	= ( options ) =>{
	return [( event ) =>
	{
		if (
			typeof event.headers['content-type'] === 'string'
			&& event.headers['content-type'].split( ';' )[0] === MULTIPART_PARSER_SUPPORTED_TYPE
		) {
			event.once( 'payloadReceived', ( rawPayload ) => {
				let formParser	= new FormParser( options );
				formParser.parse( event, rawPayload );
			});
		}
		else
		{
			event.next();
		}
	}];
};

/**
 * @brief	Middleware responsible for decoding form data passed
 *
 * @param	Object options
 * 			Accepts options:
 *
 * @return	Array
 */
middlewaresContainer.formParser	= ( options ) =>
{
	return [( event ) =>
	{
		if (
			typeof event.headers['content-type'] === 'string'
			&& event.headers['content-type'] === FORM_PARSER_SUPPORTED_TYPE
		) {
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
		}
		else
		{
			event.next();
		}
	}];
};

/**
 * @brief	Parses the given cookies and sets them to event.cookies
 *
 * @param	Object options
 * 			Accepts options:
 *
 * @return	Array
 */
middlewaresContainer.parseCookies	= ( options ) =>
{
	return [( event ) =>{
		var list = {},
			rc = event.headers.cookie;

		rc && rc.split( ';' ).forEach( function( cookie ) {
			var parts					= cookie.split( '=' );
			list[parts.shift().trim()]	= decodeURI( parts.join( '=' ) );
		});

		event.cookies	= list;
		event.next();
	}];
};

/**
 * @brief	Logs information about the current event
 *
 * @details	This should ideally be used after the static path middleware.
 * 			Accepts options:
 * 			- level - log level
 *
 * @param	Object options
 *
 * @return	Array
 */
middlewaresContainer.logger	= ( options ) => {
	return [( event ) => {
		event.logData( options.level );
		event.next();
	}];
};

/**
 * @brief	Sets the given path as the static path where resources can be delivered easily
 *
 * @param	string staticPath
 * 			Accepts options:
 * 			- path - the path to make static
 *
 * @return	Array
 */
middlewaresContainer.addStaticPath	= ( options ) => {
	let regExp	= new RegExp( '^(\/' + options.path + ')' );

	return [regExp, ( event ) => {
		let item	= path.join( __dirname + '/../../' + event.path );
		fs.readFile( item, {}, ( err, data ) => {
			if ( ! err && data )
			{
				event.response.end( data )
			}
			else
			{
				event.setError( 'File not found' );
			}
		});
	}]
};

// Export the module
module.exports	= middlewaresContainer;
