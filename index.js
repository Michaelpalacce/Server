'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const { server }	= require( './handlers/main/server/server' );

const address		= process.env.APP_ADDRESS;
const port			= require( './handlers/main/utils/get_port' );

require( './handlers/controllers' );

server.on( 'error', ( error )=>{
	Loggur.log( `There was an error while starting the server: ${error}`, Loggur.LOG_LEVELS.error );
	setImmediate(()=>{
		process.exit( 1 );
	});
});

// Start the server
server.listen( port, address, ()=>{
	Loggur.log( `Server started on port: ${port} and address: ${address}`, Loggur.LOG_LEVELS.warning );
});
