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

server.apply( 'er_logger' );
server.apply( 'er_cache_server' );
server.apply( 'er_file_stream' );
server.apply( 'er_templating_engine' );

server.apply( 'er_session' );
server.apply( 'er_body_parser_multipart' );

// Handlers
server.add( handlers );

module.exports	= server;
