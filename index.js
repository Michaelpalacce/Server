'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const app			= require( './server' );
const port			= require( './handlers/main/get_port' );
const address		= '0.0.0.0';

// Start the server
app.listen( port, address, ( error )=>{
	Loggur.log( `Server started on port: ${port} and address: ${address}` );
});
