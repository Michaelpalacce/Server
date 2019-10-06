'use strict';

// Dependencies
const server		= require( './server' );
const { Loggur }	= require( 'event_request' );

// Start the server
server.start( ( error )=>{
	if ( error === false )
	{
		Loggur.log( 'Server started' );
	}
});
