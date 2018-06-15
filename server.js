'use strict';

// Dependencies
const envConfig									= require( './config/env' );
const handlers									= require( './handlers/handlers' );
const { Server, BodyParserHandler, Logging }	= require( 'event_request' );
const path										= require( 'path' );

const { Logger, Loggur, LOG_LEVELS }			= Logging;
const { Console, File }							= Logger;

const { FormBodyParser, MultipartFormParser, JsonBodyParser }	= BodyParserHandler;

// Authentication callback that will authenticated the request if the user has permissions
// this can be changed to anything you want but must return a boolean at the end
let authenticationCallback	= ( event )=>{
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	return username === envConfig.username && password === envConfig.password;
};

// Create a custom Logger
let logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.info,
	transports	: [
		new Console({ logLevel : LOG_LEVELS.debug }),
		new File({ logLevel : LOG_LEVELS.info, filePath: '/logs/error_log.log' }),
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
server.use( 'session', {
		indexRoute				: '/browse',
		tokenExpiration			: envConfig.tokenExpiration,
		loginRoute				: '/login',
		sessionName				: 'sid',
		authenticationCallback	: authenticationCallback
	}
);
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
