'use strict';

// Dependencies
const app	= require( 'event_request' )();
const fs	= require( 'fs' );

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

require( './kernel' );

module.exports	= { server };
