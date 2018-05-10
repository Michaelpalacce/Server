'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );
const index			= require( './handlers/index/controller' );

// Start the server
server.start( env_config.port );

// Handlers
server.add( index );

// Add a 404 NOT FOUND middleware
server.add( ( event ) => {
	if ( ! event.isFinished() )
	{
		event.response.setHeader( 'Content-Type', 'text/html' );
		event.response.statusCode	= 404;
		event.render( 'not_found', { message:'404 NOT FOUND' }, ( err )=>{
			if ( err )
				event.serverError( err );
		});
	}
});
