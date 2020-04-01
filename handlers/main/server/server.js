'use strict';

// Dependencies
const http			= require( 'http' );
const { Server }	= require( 'event_request' );

const app			= Server();
const server		= http.createServer( app.attach() );
let io				= null;

// Add environment variables to the process.env
app.apply( app.er_env );

if ( process.env.ENABLE_TERMINAL == 1 )
{
	const socketIO	= require( 'socket.io' );
	io				= socketIO( server );
}

require( './kernel' );

module.exports	= { server, io };
