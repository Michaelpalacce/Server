'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const os			= require( 'os' );
const pty			= require( 'node-pty' );
const UserManager	= require( '../../../main/security/user/user_manager' );
const User			= require( '../../../main/security/user/user' );
const { io }		= require( '../../../main/server/server' );
const Acl			= require( '../../../main/acls/acl' );
const shell			= process.env.TERMINAL_TO_SPAWN !== ''
					? process.env.TERMINAL_TO_SPAWN
						: os.platform() === 'win32'
						? 'powershell.exe'
						: 'bash';

/**
 * @details	The connection will only be established if there is a sid header sent with the sid cookie
 * 			The user will also be checked if he/she is a Super User and if not, the socket will be disconnected
 */
io.on( 'connection', async ( socket ) => {
	console.log( 'here' );
	const cacheServer	= process.cachingServer;
	const token			= socket.request.headers.token;

	if ( ! token )
		return socket.disconnect( true );

	const dataSet	= await cacheServer.get( `$S:${token}` );

	if ( dataSet === null && typeof dataSet.username !== 'undefined' )
		return socket.disconnect( true );

	const user		= UserManager.get( dataSet.username );

	if ( ! Acl.is( user, User.ROLES.root ) )
		return socket.disconnect( true );

	Loggur.log( `New Socket Established: ${socket.id}` );

	const ptyProcess	= pty.spawn( shell, [], {
		name: 'xterm-color',
		cwd: process.env.HOME,
		env: process.env
	});

	ptyProcess.resize( 110, 50 );

	socket.on( 'data', message => ptyProcess.write( message ) );

	ptyProcess.on( 'data', data => socket.emit( 'data', data ) );

	socket.on( 'disconnect', () => {
		ptyProcess.kill();
		Loggur.log( `Socket Disconnected: ${socket.id}` );
	});
});
