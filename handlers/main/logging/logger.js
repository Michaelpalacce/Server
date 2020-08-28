'use strict';

// Dependencies
const { Logging }							= require( 'event_request' );
const { Console, File, Loggur, LOG_LEVELS }	= Logging;
const path									= require( 'path' );
const PROJECT_ROOT							= path.parse( require.main.filename ).dir;

/**
 * @brief	Logs to the /logs/access.log
 *
 * @details	Logs on a level of notice where the only thing being logged there is the routing information
 */
const accessFileLog		= new File({
	logLevel	: LOG_LEVELS.notice,
	filePath	: path.join( PROJECT_ROOT, '/logs/access.log' ),
	logLevels	: { notice : LOG_LEVELS.notice }
});

/**
 * @brief	Logs errors to /logs/error.log
 */
const errorFileLog		= new File({
	logLevel	: LOG_LEVELS.error,
	filePath	: path.join( PROJECT_ROOT, '/logs/error.log' ),
});

/**
 * @brief	Transports to be added to the Logger
 */
const transports		= [accessFileLog, errorFileLog];

if ( typeof process.env !== 'undefined' && process.env.DEBUG == 1 )
{
	/**
	 * @brief	Logs all information capable of logging to /logs/debug.log
	 *
	 * @details	Will be enabled only if environment variable DEBUG === 1
	 */
	const debugFileLog		= new File({
		logLevel	: LOG_LEVELS.debug,
		filePath	: path.join( PROJECT_ROOT, '/logs/debug.log' )
	});

	/**
	 * @brief	Logs Everything below a notice level to the console
	 *
	 * @details	Will be enabled only if environment variable DEBUG === 1
	 */
	const debugConsoleLog	= new Console( { logLevel : LOG_LEVELS.notice } );

	transports.push( debugConsoleLog );
	transports.push( debugFileLog );
}

// The Id of the new logger
const loggerId	= 'server-emulator';

// The new Logger
const logger	= Loggur.createLogger({
	serverName	: 'Server-Emulator',
	logLevel	: LOG_LEVELS.debug,
	capture		: false,
	transports
});

// Adds a Logger to the Loggur with an id of storage
Loggur.addLogger( loggerId, logger );

module.exports	= logger;