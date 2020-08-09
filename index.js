'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const { server }	= require( './handlers/main/server/server' );
const fs			= require( 'fs' );
const path			= require( 'path' );

const address		= process.env.APP_ADDRESS;
const port			= require( './handlers/main/utils/get_port' );

const lockFile		= path.join( __dirname, 'pid.lock' );
const processPid	= process.pid;

fs.writeFileSync( lockFile, processPid + '' );

require( './handlers/controllers' );

server.on( 'error', ( error )=>{
	Loggur.log( `There was an error while starting the server: ${error}`, Loggur.LOG_LEVELS.error );
	setImmediate(()=>{
		process.exit( 1 );
	});
});

// Start the server
server.listen( port, address, ()=>{
	Loggur.log( `Server started on port: ${port} and address: ${address} with PID: ${processPid}`, Loggur.LOG_LEVELS.warning );
});

/**
 * @brief	Glory to StackOverflow
 */
function exitHandler( options, exitCode )
{
	if ( options.cleanup )
		fs.unlinkSync( lockFile );

	if ( options.exit )
		process.exit();
}

//do something when app is closing
process.on( 'exit', exitHandler.bind( null, { cleanup: true } ) );

//catches ctrl+c event
process.on( 'SIGINT', exitHandler.bind( null, { exit: true } ) );

// catches "kill pid" (for example: nodemon restart)
process.on( 'SIGUSR1', exitHandler.bind( null, { exit: true } ) );
process.on( 'SIGUSR2', exitHandler.bind( null, { exit: true } ) );