'use strict';

// Dependencies
const { Server, BodyParserHandler, PluginManager, Loggur }	= require( 'event_request' );
const path													= require( 'path' );
const ejs													= require( 'ejs' );
const envConfig												= require( './config/env' );
const handlers												= require( './handlers/handlers' );
const sessionPlugin											= require( './handlers/main/security' );
const logger												= require( './handlers/main/logger' );
const { FormBodyParser, MultipartFormParser }				= BodyParserHandler;

/**
 * @brief	Instantiate the server
 */
const server	= new Server();

let staticResourcesPlugin	= PluginManager.getPlugin( 'event_request_static_resources' );
let timeoutPlugin			= PluginManager.getPlugin( 'event_request_timeout' );
let fileStreamPlugin		= PluginManager.getPlugin( 'event_request_file_stream' );
let templatingEnginePlugin	= PluginManager.getPlugin( 'event_request_templating_engine' );
let cacheServerPlugin		= PluginManager.getPlugin( 'cache_server' );
cacheServerPlugin.startServer( ()=>{
	Loggur.log( 'Caching server started' );
});

staticResourcesPlugin.setOptions( { paths : [envConfig.staticPath, 'favicon.ico'] } );
timeoutPlugin.setOptions( { timeout : envConfig.requestTimeout } );
templatingEnginePlugin.setOptions( { templateDir : path.join( __dirname, './templates' ), engine : ejs } );

logger.attachLogger( server );
server.apply( cacheServerPlugin );
server.apply( staticResourcesPlugin );
server.apply( timeoutPlugin );
server.apply( fileStreamPlugin );
server.apply( templatingEnginePlugin );

server.use( 'parseCookies' );
server.use( 'bodyParser', { parsers: [ { instance : FormBodyParser } ] } );
server.apply( sessionPlugin );
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
