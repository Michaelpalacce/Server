'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const handlers		= require( './handlers/handlers' );

/**
 * @brief	Instantiate the server
 */
let server	= Server();

server.apply( 'er_env' );

// Configure the plugins
require( './handlers/main/bootstrap_plugins' );

server.apply( server.er_static_resources, { paths : [process.env.STATIC_PATH, 'favicon.ico'] } );
server.apply( server.er_body_parser_form );
server.apply( server.er_body_parser_json );
server.apply( server.er_body_parser_multipart );
server.apply( server.er_timeout, { timeout : process.env.REUQEST_TIMEOUT } );
server.apply( server.er_rate_limits );
server.apply( server.er_logger );
server.apply( server.er_cache_server );
server.apply( server.er_response_cache );
server.apply( server.er_file_stream );
server.apply( server.er_templating_engine );

server.apply( server.er_session );


// Handlers
server.add( handlers );
