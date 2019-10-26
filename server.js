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

server.apply( 'er_static_resources', { paths : [process.env.STATIC_PATH, 'favicon.ico'] } );
server.apply( 'er_timeout', { timeout : process.env.REUQEST_TIMEOUT } );
server.apply( 'er_logger' );
server.apply( 'er_cache_server' );
server.apply( 'er_response_cache' );
server.apply( 'er_file_stream' );
server.apply( 'er_templating_engine' );
server.apply( 'er_rate_limits' );

server.apply( 'er_session', { ttl: 60 * 60 } );
server.apply( 'er_body_parser_multipart' );

// Handlers
server.add( handlers );

server.port		= process.env.PORT;
module.exports	= server;
