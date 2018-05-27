'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );
const handlers		= require( './handlers/handlers' );
const security		= require( './handlers/main/security/security' );

server.use( 'addStaticPath', { path : env_config.staticPath } );
server.use( 'addStaticPath', { path : 'favicon.ico' } );

server.use( 'parseCookies' );
server.use( 'timeout', { timeout : 60 } );
server.use( 'formParser', { maxPayloadLength : 1048576 } );

//Authentication middleware
server.add( security );

server.use( 'multipartParser', { BufferSize : 5242880 } );
server.use( 'logger', { level : 1 } );

// Handlers
server.add( handlers );

// Add a 404 NOT FOUND middleware
server.add( ( event ) => {
	if ( ! event.isFinished() )
	{
		event.response.setHeader( 'Content-Type', 'text/html' );
		event.response.statusCode	= 404;
		event.render( 'not_found', { message: '404 NOT FOUND' }, ( err )=>{
			if ( err )
				event.serverError( 'Could not render template' );
		});
	}
});

// Start the server
server.start( env_config.port );

//@TODO MAKE THIS CLEAN UP .data/tokens every one day
setInterval( () => {

});
