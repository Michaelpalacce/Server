'use strict';

const envConfig	= require( './lib/config/env' );
const handlers	= require( './handlers/handlers' );
const Server	= require( './lib/www' );

const server	= new Server.Server();

server.use( 'addStaticPath', { path : envConfig.staticPath } );
server.use( 'addStaticPath', { path : 'favicon.ico' } );
server.use( 'logger', { level : 1 } );
server.use( 'timeout', { timeout : envConfig.requestTimeout } );
server.use( 'parseCookies' );
server.use( 'bodyParser', { FormBodyParser: { maxPayloadLength : 1048576 } } );
server.use( 'bodyParser', { MultipartFormParser: { BufferSize : 5242880 } } );
server.use( 'session',
	{
		managers				: ['default'],
		indexRoute				: '/browse',
		loginRoute				: '/login',
		sessionName				: 'sid',
		authenticationCallback	: ( event ) =>{
			let username	= typeof event.body.username === 'string' ? event.body.username : false;
			let password	= typeof event.body.password === 'string' ? event.body.password : false;

			return username === envConfig.username && password === envConfig.password;
		}
	}
);

// Handlers
server.add( handlers );

server.add( '/test/:Profile:/:id:', 'GET', ( event ) =>{
	event.next();
});

server.add( '/test/:ProfileTwo:/:idTwo:', 'GET', ( event ) =>{
	event.next();
});

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

module.exports	= server;
