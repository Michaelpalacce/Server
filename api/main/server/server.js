'use strict';

// Dependencies
const app		= require( 'event_request' )();
// const socketIO	= require( 'socket.io' );
const fs		= require( 'fs' );

let server;
const hasSSL	= process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH;

if ( hasSSL )
{
	const https	= require( 'https' );
	server		= https.createServer(
		{
			key		: fs.readFileSync( process.env.SSL_KEY_PATH ),
			cert	: fs.readFileSync( process.env.SSL_CERT_PATH )
		},
		app.attach()
	);
}
else
{
	const http	= require( 'http' );
	server		= http.createServer( app.attach() );
}

// const io	= socketIO( server, {
// 	cors: {
// 		origin: `*`,
// 		methods: ['GET', 'POST'],
// 		allowedHeaders: ['token'],
// 	}
// } );

require( './kernel' );

module.exports	= { server };
