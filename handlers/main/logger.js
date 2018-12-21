'use strict';

// Dependencies
const { Logging }							= require( 'event_request' );
const { LOG_LEVELS, Console, File, Loggur }	= Logging;

// Create a custom Logger
let logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.debug,
	capture		: false,
	transports	: [
		new Console( { logLevel : LOG_LEVELS.notice } ),
		new File({
			logLevel	: LOG_LEVELS.notice,
			filePath	: '/logs/access.log',
			logLevels	: { notice : LOG_LEVELS.notice }
		}),
		new File({
			logLevel	: LOG_LEVELS.error,
			filePath	: '/logs/error_log.log',
		}),
		new File({
			logLevel	: LOG_LEVELS.debug,
			filePath	: '/logs/debug_log.log'
		})
	]
});

Loggur.addLogger( 'storage', logger );

module.exports	= {
	attachLogger	: ( server ) => {
		server.use( 'logger', { logger } );
	}
};
