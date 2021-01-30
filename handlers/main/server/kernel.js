'use strict';

// Dependencies
const app			= require( 'event_request' )();
const ejs			= require( 'ejs' );
const path			= require( 'path' );

const ErrorHandler	= require( '../error/error_handler' );
const logger		= require( '../logging/logger' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

// Attach a render function
app.add(( event ) => {
	event.render	= async ( templateName, variables = {} ) => {
		event.setResponseHeader( 'Content-Type', 'text/html' ).send( await event.getRenderedData( templateName, variables ) );
	};

	event.getRenderedData	= async ( templateName, variables = {} ) => {
		return await ejs.renderFile( path.join( PROJECT_ROOT, process.env.TEMPLATING_DIR, templateName + '.ejs' ), variables );
	};

	event.on( 'cleanUp', () => { event.render = undefined; event.getRenderedData = undefined; });

	event.next();
});

// Add Error Handler
app.add(( event ) => {
	event.errorHandler	= ErrorHandler;

	event.next();
});

if ( process.env.ENABLE_SECURITY_HEADERS === '1' )
{
	app.apply( app.er_security, {
		csp	: {
			directives	: {
				'font-src'	: ['https://fonts.gstatic.com']
			}
		}
	});
}

// Serve Static Resources
app.apply( app.er_static,					{ paths	: [process.env.STATIC_PATH], cache: { static : false }, useEtag: true } );
app.apply( app.er_static,					{ paths	: ['favicon.ico'], cache: { static : false }, useEtag: true } );

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
app.apply( app.er_body_parser_multipart,	{ tempDir	: path.join( PROJECT_ROOT, process.env.UPLOADS_DIR ) } );
app.apply( app.er_body_parser_raw );

// Add Timeout
app.apply( app.er_timeout,					{ timeout	: process.env.REQUEST_TIMEOUT } );

// Add a logger
app.apply( app.er_logger,					{ logger } );

// Attach the file streamers
app.apply( app.er_file_stream );

// Add a user cookie session
app.apply( app.er_session );

// Attach the caching server to the process
process.cachingServer	= app.getPlugin( app.er_data_server ).getServer();
