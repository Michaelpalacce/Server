'use strict';

const term		= new Terminal();
const socket	= io();

// Initialize the terminal
term.open( document.getElementById( 'terminal' ) );

// Log Connect/Disconnect
socket.on( 'connect', ()=>{ console.log( 'Connected to server' ); });
socket.on( 'disconnect', ()=>{ console.log( 'Disconnected from server' ); });

// Receive data from the server
socket.on( 'data', ( data )=>{
	term.write( data );
});

// Send data to the server
term.onData(( data )=>{
	socket.emit( 'data', data );
});

// Refresh the terminal
socket.emit( 'data', '' );