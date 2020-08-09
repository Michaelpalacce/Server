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

const handle	= () => { fs.unlinkSync( lockFile ); }

process.on( 'exit', handle );
process.on( 'SIGINT', handle );
process.on( 'SIGHUP', handle );
process.on( 'SIGKILL', handle );
process.on( 'beforeExit', handle );
