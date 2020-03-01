'use strict';

// Dependencies
const { Server, Loggur }	= require( 'event_request' );
const app					= require( './server' );

// Start the server
app.listen( process.env.PORT || 80, '0.0.0.0', ( error )=>{
	Loggur.log( 'Server started' );
});
