'use strict';

// Dependencies
const { Server, BodyParserHandler, Logging }	= require( 'event_request' );
const path										= require( 'path' );
const envConfig									= require( './config/env' );
const handlers									= require( './handlers/handlers' );
const security									= require( './handlers/main/security' );

const { Logger, Loggur, LOG_LEVELS }			= Logging;
const { Console, File }							= Logger;
const { FormBodyParser, MultipartFormParser }	= BodyParserHandler;

// Create a custom Logger
let logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.info,
	transports	: [
		new Console( { logLevel : LOG_LEVELS.info } ),
		new File( {
			logLevel	: LOG_LEVELS.notice,
			filePath	: '/logs/access.log',
			logLevels	: { notice : LOG_LEVELS.notice }
		}),
		new File( {
			logLevel	: LOG_LEVELS.warning,
			filePath	: '/logs/error.log',
			logLevels	: { error : LOG_LEVELS.error, warning : LOG_LEVELS.warning }
		}),
	]
});

Loggur.addLogger( 'storage', logger );

/**
 * @brief	Instantiate the server
 */
const server				= new Server({
	port			: 3000,
	protocol		: 'http',
	clusters		: 1
});

server.use( 'addStaticPath', { path : envConfig.staticPath } );
server.use( 'addStaticPath', { path : 'favicon.ico' } );
server.use( 'logger', { logger : logger } );
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
					event.sendError( 'Could not render template' );
			});
		}
	}
});

module.exports	= server;
