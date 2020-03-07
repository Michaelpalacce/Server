'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const ejs			= require( 'ejs' );
const path			= require( 'path' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Instantiate the server
 */
const app	= Server();

app.apply( 'er_env' );

// Configure the plugins
require( './handlers/main/bootstrap_plugins' );

app.apply( app.er_static_resources, { paths : [process.env.STATIC_PATH, 'favicon.ico'] } );
app.apply( app.er_body_parser_form );
app.apply( app.er_body_parser_json );
app.apply( app.er_body_parser_multipart, { tempDir : path.join( PROJECT_ROOT, process.env.UPLOADS_DIR ) } );
app.apply( app.er_timeout, { timeout : process.env.REQUEST_TIMEOUT } );
app.apply( app.er_rate_limits );
app.apply( app.er_logger );
app.apply( app.er_cache_server );
app.apply( app.er_response_cache );
app.apply( app.er_file_stream );
app.apply( app.er_templating_engine, { templateDir : path.join( PROJECT_ROOT, process.env.TEMPLATING_DIR ), engine : ejs } );

app.apply( app.er_session );

// Handlers
app.add( require( './handlers/handlers' ) );

module.exports	= app;
