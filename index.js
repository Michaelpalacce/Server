'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const { server }	= require( './handlers/main/server/server' );
const port			= require( './handlers/main/utils/get_port' );
const address		= '0.0.0.0';

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
