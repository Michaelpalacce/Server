'use strict';

// Dependencies
const { Logging }						= require( 'event_request' );
const { Logger, Loggur, LOG_LEVELS }	= Logging;
const { Console, File }					= Logger;

// Create a custom Logger
let logger	= Loggur.createLogger({
	serverName	: 'Storage',
	logLevel	: LOG_LEVELS.debug,
	transports	: [
		new Console( { logLevel : LOG_LEVELS.notice } ),
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

module.exports	= {
	attachLogger	: ( server ) => {
		server.use( 'logger', { logger : logger } );
	}
};
