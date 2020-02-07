'use strict';

// Dependencies
const { Server, Loggur }	= require( 'event_request' );
require( './server' );

// Start the server
Server.start( process.env.PORT, '0.0.0.0', ( error )=>{
	Loggur.log( 'Server started' );
});
