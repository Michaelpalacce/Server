'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );
const index			= require( './handlers/index/controller' );
const browse		= require( './handlers/browse/controller' );
const download		= require( './handlers/download/controller' );
const login			= require( './handlers/login/controller' );
const upload		= require( './handlers/upload/controller' );
const security		= require( './handlers/main/security/security' );

// Start the server
server.start( env_config.port );

server.addStaticPath( env_config.staticPath );
server.addStaticPath( 'favicon.ico' );

server.logger( 1 );
server.use( 'formParser' );
server.use( 'parseCookies' );

//Authentication middleware
server.add( security );

// Handlers
server.add( index );
server.add( browse );
server.add( download );
server.add( login );
server.add( upload );

// Add a 404 NOT FOUND middleware
server.add( ( event ) => {
	if ( ! event.isFinished() )
	{
		event.response.setHeader( 'Content-Type', 'text/html' );
		event.response.statusCode	= 404;
		event.render( 'not_found', { message: '404 NOT FOUND' }, ( err )=>{
			if ( err )
				event.serverError( err );
		});
	}
});

//@TODO MAKE THIS CLEAN UP .data/tokens every one day
setInterval( () => {

});
