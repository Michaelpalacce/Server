'use strict';

// Dependencies
const { Loggur }	= require( 'event_request' );
const os			= require( 'os' );
const pty			= require( 'node-pty' );
const { io }		= require( '../../main/server/server' );
const shell			= os.platform() === 'win32' ? 'powershell.exe' : 'bash';

io.on( 'connection', ( socket )=>{
	Loggur.log( `New Socket Established: ${socket.id}` );

	const ptyProcess	= pty.spawn( shell, [], {
		name: 'xterm-color',
		cols: 80,
		rows: 30,
		cwd: process.env.HOME,
		env: process.env
	});

	socket.on( 'data', ( message )=>{
		ptyProcess.write( message );
	});

	ptyProcess.on('data', ( data )=>{
		socket.emit( 'data', data );
	});

	socket.on( 'disconnect', ()=>{
		Loggur.log( `Socket Disconnected: ${socket.id}` )
	});
});
