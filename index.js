'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const { server }	= require( './handlers/main/server/server' );
const port			= require( './handlers/main/utils/get_port' );
const address		= '0.0.0.0';

require( './handlers/controllers' );

// Start the server
server.listen( port, address, ( error )=>{
	if ( error )
		return Loggur.log( `There was an error while starting the server: ${error.text}` );

	Loggur.log( `Server started on port: ${port} and address: ${address}` );
});
