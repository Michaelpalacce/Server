'use strict';

// Dependencies
const server		= require( './server' );
const { Loggur }	= require( 'event_request' );

// Start the server
server.start( ()=>{
	Loggur.log( 'Server started' );
});
