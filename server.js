'use strict';

// Dependencies
const { Server, BodyParserHandler, ErrorHandler }	= require( 'event_request' );
const path											= require( 'path' );
const envConfig										= require( './config/env' );
const handlers										= require( './handlers/handlers' );
const security										= require( './handlers/main/security' );
const logger										= require( './handlers/main/logger' );

const { FormBodyParser, MultipartFormParser }	= BodyParserHandler;

/**
 * @brief	Instantiate the server
 */
const server	= new Server({
	port			: 3000,
	protocol		: 'http',
	clusters		: 1,
	errorHandler	: new ErrorHandler()
});

server.use( 'addStaticPath', { path : envConfig.staticPath } );
server.use( 'addStaticPath', { path : 'favicon.ico' } );
logger.attachLogger( server );
server.use( 'timeout', { timeout : envConfig.requestTimeout } );
server.use( 'setFileStream' );
server.use( 'templatingEngine', { options : { templateDir : path.join( __dirname, './templates' ) } } );
server.use( 'parseCookies' );
server.use( 'bodyParser', { parsers: [ { instance : FormBodyParser } ] } );
security.attachSecurity( server );
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
			event.response.setHeader( 'Content-Type', 'text/html' );
			event.response.statusCode	= 404;
			event.render( 'not_found', { message: '404 NOT FOUND' }, ( err )=>{
				if ( err )
					event.next( 'Could not render template' );
			});
		}
	}
});

module.exports	= server;
