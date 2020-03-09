'use strict';

const { Server, Logging }					= require( 'event_request' );
const { Console, File, Loggur, LOG_LEVELS }	= Logging;

const transports	= [
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

const logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.debug,
	capture		: false,
	transports	: transports
});

const app				= Server();
const PluginManager		= app.getPluginManager();
const cacheServerPlugin	= PluginManager.getPlugin( app.er_cache_server );
const loggerPlugin		= PluginManager.getPlugin( app.er_logger );

const dataServer		= cacheServerPlugin.getServer();
process.cachingServer	= dataServer;

dataServer.set( process.env.ADMIN_USERNAME, { password : process.env.ADMIN_PASSWORD, route : '/' }, -1 );

loggerPlugin.setOptions({ logger });
Loggur.addLogger( logger );