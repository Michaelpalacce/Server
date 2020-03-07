'use strict';

// Dependencies
const { Server, Loggur }	= require( 'event_request' );
const app					= require( './server' );

// Start the server
app.listen( require( './handlers/main/get_port' ), '0.0.0.0', ( error )=>{
	Loggur.log( 'Server started' );
});
