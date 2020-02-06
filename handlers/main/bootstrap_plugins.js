'use strict';

const ejs															= require( 'ejs' );
const path															= require( 'path' );
const { Loggur, BodyParserHandler, Logging, LOG_LEVELS, Server }	= require( 'event_request' );
const { MultipartFormParser }										= BodyParserHandler;
const PROJECT_ROOT													= path.parse( require.main.filename ).dir;
const { Console, File }												= Logging;

let transports	= [
	new File({
		logLevel	: LOG_LEVELS.notice,
		filePath	: '/logs/access.log',
		logLevels	: { notice : LOG_LEVELS.notice }
	}),
	new File({
		logLevel	: LOG_LEVELS.error,
		filePath	: '/logs/error_log.log',
	})
];

if ( typeof process.env !== 'undefined' && process.env.DEBUG == 1 )
{
	transports.push(
		new Console( { logLevel : LOG_LEVELS.notice } ),
		new File({
			logLevel	: LOG_LEVELS.debug,
			filePath	: '/logs/debug_log.log'
		})
	);
}

let logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.debug,
	capture		: false,
	transports	: transports
});

const server					= Server();
const PluginManager				= server.getPluginManager();
const templatingEnginePlugin	= PluginManager.getPlugin( 'er_templating_engine' );
const cacheServerPlugin			= PluginManager.getPlugin( 'er_cache_server' );
const multipartBodyParserPlugin	= PluginManager.getPlugin( 'er_body_parser_multipart' );
const loggerPlugin				= PluginManager.getPlugin( 'er_logger' );

const dataServer				= cacheServerPlugin.getServer();
process.cachingServer			= dataServer;

dataServer.set( process.env.ADMIN_USERNAME, { password : process.env.ADMIN_PASSWORD, route : '\\' }, -1 );

templatingEnginePlugin.setOptions( { templateDir : path.join( PROJECT_ROOT, process.env.TEMPLATING_DIR ), engine : ejs } );
multipartBodyParserPlugin.setOptions({
	parsers: [{ instance : MultipartFormParser, options : { tempDir : path.join( PROJECT_ROOT, process.env.UPLOADS_DIR ) } }]
});

loggerPlugin.setOptions({ logger });
Loggur.addLogger( logger );
