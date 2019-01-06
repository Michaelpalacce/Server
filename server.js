'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const handlers		= require( './handlers/handlers' );

// Configure the plugins
require( './handlers/main/bootstrap_plugins' );

/**
 * @brief	Instantiate the server
 */
const server	= Server();

server.apply( 'event_request_logger' );
server.apply( 'cache_server' );
server.apply( 'event_request_static_resources' );
server.apply( 'event_request_timeout' );
server.apply( 'event_request_file_stream' );
server.apply( 'event_request_templating_engine' );

server.apply( 'event_request_body_parser_form' );
server.apply( 'event_request_session' );
server.apply( 'event_request_body_parser_multipart' );

// Handlers
server.add( handlers );

module.exports	= server;
