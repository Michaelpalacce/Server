'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const ejs			= require( 'ejs' );
const path			= require( 'path' );

const ErrorHandler	= require( '../error/error_handler' );
const logger		= require( '../logging/logger' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Instantiate the server
 */
const app	= Server();

if ( process.env.ENABLE_SECURITY_HEADERS == 1 )
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
app.apply( app.er_static_resources,			{ paths	: [process.env.STATIC_PATH] } );
app.apply( app.er_static_resources,			{ paths	: ['favicon.ico'] } );
app.apply( app.er_static_resources,			{ paths	: ['node_modules/xterm/lib'] } );
app.apply( app.er_static_resources,			{ paths	: ['node_modules/xterm/css'] } );

// Rate Limit the request
app.apply( app.er_rate_limits );

// Add Timeout
app.apply( app.er_timeout,					{ timeout	: process.env.REQUEST_TIMEOUT } );

// Parse body
app.apply( app.er_body_parser_form );
app.apply( app.er_body_parser_json );
app.apply( app.er_body_parser_multipart,	{ tempDir	: path.join( PROJECT_ROOT, process.env.UPLOADS_DIR ) } );

// Add a logger
app.apply( app.er_logger,					{ logger } );

// Attach the cache server
app.apply( app.er_cache_server );

// Return response from response cache if available ( the location of this cache can be changed in the future )
app.apply( app.er_response_cache );

// Attach the file streamers
app.apply( app.er_file_stream );

// Attach a render function
app.add(( event )=>{
	event.render	= ( templateName, variables = {} )=>{
		return ejs.renderFile( path.join( process.env.TEMPLATING_DIR, templateName + '.ejs' ), variables )
			.then( data =>{
				event.setHeader( 'Content-Type', 'text/html' );
				event.send( data, 200 );
			}).catch( event.next );
	};

	event.on( 'cleanUp', ()=>{ event.render	= undefined; });

	event.next();
});

// Add Error Handler
app.add(( event )=>{
	event.errorHandler	= new ErrorHandler();

	event.next();
});

// Add a user cookie session
app.apply( app.er_session );

// Attach the caching server to the process
process.cachingServer	= app.getPluginManager().getPlugin( app.er_cache_server ).getServer();
