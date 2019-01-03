'use strict';

// Dependencies
const { Server, BodyParserHandler }				= require( 'event_request' );
const path										= require( 'path' );
const handlers									= require( './handlers/handlers' );
const logger									= require( './handlers/main/logger' );
const bootstrapPlugins							= require( './handlers/main/bootstrap_plugins' );
const { FormBodyParser, MultipartFormParser }	= BodyParserHandler;

/**
 * @brief	Instantiate the server
 */
const server	= new Server();

logger.attachLogger( server );
bootstrapPlugins( server );

server.apply( 'cache_server' );
server.apply( 'event_request_static_resources' );
server.apply( 'event_request_timeout' );
server.apply( 'event_request_file_stream' );
server.apply( 'event_request_templating_engine' );

server.use( 'parseCookies' );
server.use( 'bodyParser', { parsers: [ { instance : FormBodyParser } ] } );
server.apply( 'event_request_session' );
server.use( 'bodyParser', {
	parsers: [{ instance : MultipartFormParser, options : { tempDir : path.join( __dirname, '/Uploads' ) } }]
});

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
