'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );
const index			= require( './handlers/index/controller' );
const browse		= require( './handlers/browse/controller' );
const download		= require( './handlers/download/controller' );
const login			= require( './handlers/login/controller' );

// Start the server
server.start( env_config.port );

server.addStaticPath( env_config.staticPath );

//Authentication middleware
//@TODO FIX THIS
server.add( ( event ) => {
		event.next();
});

// Handlers
server.add( index );
server.add( browse );
server.add( download );
server.add( login );

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
