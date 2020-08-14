'use strict';

// Dependencies
const app		= require( 'event_request' )();
const helper	= require( '../../../cli_helper/cli_helper' );
const fs		= require( 'fs' );
let io			= null;

let server;

// Add environment variables to the process.env
app.apply( app.er_env, { fileLocation: helper.locator.envFile } );

if ( process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH )
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

if ( process.env.ENABLE_TERMINAL == 1 )
{
	const socketIO	= require( 'socket.io' );
	io				= socketIO( server );
}

require( './kernel' );

module.exports	= { server, io };
