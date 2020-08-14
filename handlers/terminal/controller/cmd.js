'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const os			= require( 'os' );
const pty			= require( 'node-pty' );
const { io }		= require( '../../main/server/server' );
const shell			= process.env.TERMINAL_TO_SPAWN !== ''
					? process.env.TERMINAL_TO_SPAWN
						: os.platform() === 'win32'
						? 'powershell.exe'
						: 'bash';

/**
 * @details	The connection will only be established if there is a sid header sent with the sid cookie
 * 			The user will also be checked if he/she is a Super User and if not, the socket will be disconnected
 */
io.on( 'connection', async ( socket )=>{
	const cacheServer	= process.cachingServer;
	const sidCookie		= socket.request.headers.sid;

	if ( ! sidCookie )
		return socket.disconnect( true );

	const dataSet	= await cacheServer.get( `$S:${sidCookie}` );

	if ( dataSet === null || dataSet.SU !== true )
		return socket.disconnect( true );

	Loggur.log( `New Socket Established: ${socket.id}` );

	const ptyProcess	= pty.spawn( shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.env.HOME,
		env: process.env
	});

	ptyProcess.resize(150, 60);

	socket.on( 'data', ( message )=>{
		ptyProcess.write( message );
	});

	ptyProcess.on('data', ( data )=>{
		socket.emit( 'data', data );
	});

	socket.on( 'disconnect', ()=>{
		ptyProcess.kill();
		Loggur.log( `Socket Disconnected: ${socket.id}` )
	});
});
