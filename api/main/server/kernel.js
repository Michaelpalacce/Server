'use strict';

// Dependencies
const app			= require( 'event_request' )();
const path			= require( 'path' );

const ErrorHandler	= require( '../error/error_handler' );
const logger		= require( '../logging/logger' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

app.apply( app.er_cors, {
	origin: 'er_dynamic',
	headers: [
		'Access-Control-Allow-Headers',
		'Origin',
		'Accept',
		'X-Requested-With',
		'Cache-Control',
		'Content-Type',
		'Referer',
		'User-Agent',
		'Access-Control-Request-Method',
		'Access-Control-Request-Headers',
		'token',
		'DNT',
		'sec-ch-ua',
		'sec-ch-ua-mobile'
	],
	exposedHeaders: ['token'],
	credentials: true
});

// Add Error Handler
app.add(( event ) => {
	event.errorHandler	= ErrorHandler;

	event.next();
});

// Serve Static Resources
app.apply( app.er_static, { paths	: ['public/js', 'public/css', 'public/fonts', 'favicon.ico'], cache: { static : false }, useEtag: true } );

app.er_validation.setOptions({
	failureCallback: ( event, parameter, result ) => {
		event.next( `Invalid input: ${JSON.stringify( result.getValidationResult() )}`, 400 );
	}
});

// Attach the cache server
app.apply( app.er_data_server, { dataServerOptions: { persist: true } } );

// Rate Limit the request
app.apply( app.er_rate_limits, { useFile: true } );

// Parse body
app.apply( app.er_body_parser_form );
app.apply( app.er_body_parser_json );
app.apply( app.er_body_parser_multipart,	{ tempDir	: path.join( PROJECT_ROOT, './Uploads' ) } );
app.apply( app.er_body_parser_raw );

// Add Timeout
app.apply( app.er_timeout,					{ timeout	: 60000 } );

// Add a logger
app.apply( app.er_logger,					{ logger } );

// Attach the file streamers
app.apply( app.er_file_stream );

// Add a user cookie session
app.apply( app.er_session, { isCookieSession: true, isSecureCookie:true, sessionKey: 'token' } );

// Attach the caching server to the process
process.cachingServer	= app.getPlugin( app.er_data_server ).getServer();
// Require ACL AFTER the caching server has been set
require( '../acls/acl' )