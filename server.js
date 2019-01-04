'use strict';

// Dependencies
const { Server }		= require( 'event_request' );
const path				= require( 'path' );
const handlers			= require( './handlers/handlers' );
const bootstrapPlugins	= require( './handlers/main/bootstrap_plugins' );

/**
 * @brief	Instantiate the server
 */
const server	= new Server();

bootstrapPlugins();

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

// Add a 404 NOT FOUND middleware
server.add({
	handler	: ( event ) => {
		if ( ! event.isFinished() )
		{
			event.setHeader( 'Content-Type', 'text/html' );
			event.response.statusCode	= 404;
			event.sendError( 'NOT FOUND' );
		}
	}
});

module.exports	= server;
