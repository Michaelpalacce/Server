'use strict';

// Dependencies
const MultipartFormParser	= require( './middlewares/multipart_data_parser' );
const FormBodyParser		= require( './middlewares/form_body_parser' );
const fs					= require( 'fs' );
const path					= require( 'path' );
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
 *
 * @return	Array
 */
middlewaresContainer.multipartParser	= ( options ) =>{
	return [( event ) =>
	{
		if (
			typeof event.headers['content-type'] === 'string'
			&& event.headers['content-type'].match( MULTIPART_PARSER_SUPPORTED_TYPE ) !== null
		) {
			let payloadReceivedCallback	= ( rawPayload ) => {
				let multipartFormParser	= new MultipartFormParser( options );
				multipartFormParser.parse( event.headers, rawPayload, ( err, body, files ) => {
					if ( err )
					{
						event.setError( err );
					}
					else
					{
						event.extra.files	= files;
						event.body			= body;

						event.emit( 'bodyparsed' )

						event.next();
					}
				});
			};

			if ( event.isPayloadParsed() )
			{
				event.getPayload().then( payloadReceivedCallback ).catch( ( err ) => { event.setError( err ); });
			}
			else
			{
				event.once( 'payloadReceived', payloadReceivedCallback );
			}
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
			&& event.headers['content-type'].match( FORM_PARSER_SUPPORTED_TYPE ) !== null
		) {
			let formBodyParser			= new FormBodyParser( options );
			let payloadReceivedCallback	= ( rawPayload ) =>
			{
				formBodyParser.parseFormBody( rawPayload, ( err, body )=>{
					if ( ! err )
					{
						event.body	= body;
						event.emit( 'bodyparsed' )
						event.next();
					}
					else
					{
						event.setError( err );
					}
				});
			};

			if ( event.isPayloadParsed() )
			{
				event.getPayload().then( payloadReceivedCallback ).catch( ( err ) => { event.setError( err ); });
			}
			else
			{
				event.once( 'payloadReceived', payloadReceivedCallback );
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

/**
 * @brief	Adds a timeout middleware that will cause the event to timeout after a sepcific time
 *
 * @param	string staticPath
 * 			Accepts options:
 * 			- timeout - the amount in seconds to cause the timeout defaults to 60
 *
 * @return	Array
 */
middlewaresContainer.timeout	= ( options ) =>
{
	let timeout	= typeof options.timeout === 'number' ? parseInt( options.timeout ) : 60;

	return [( event ) => {
		event.once( 'payloadReceived', () => {
			event.internalTimeout	= setTimeout( () => {
				console.log( 'Request timed out' );
					if ( ! event.isFinished() )
					{
						event.serverError( 'TIMEOUT' );
					}
				},
				timeout * 1000
			);

			event.next();
		});
	}];
};

// Export the module
module.exports	= middlewaresContainer;
