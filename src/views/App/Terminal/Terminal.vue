<template>
	<div class="" style="width: 500px">
		<div id="terminal"></div>
	</div>
</template>

<script>
import { Terminal }	from 'xterm/lib/xterm'
import io			from "socket.io-client";
import communicator	from "@/app/main/api/communicator";

export default {
	name: 'Terminal',
	mounted()
	{
		const term		= new Terminal();
		const socket	= io( communicator.getApiUrl(), {
			extraHeaders: communicator.getAuthHeaders(),
			transportOptions: {
				polling: {
					extraHeaders: communicator.getAuthHeaders()
				}
			}
		});

		// Initialize the terminal
		term.open( document.getElementById( 'terminal' ) );

		term.resize( 110, 50 );

		socket.on( 'connect', () => {
			// Receive data from the server
			socket.on( 'data', data => term.write( data ) );
			// Send data to the server
			term.onData( data => socket.emit( 'data', data ) );

			// Refresh the terminal
			socket.emit( 'data', '' );
		});

		socket.on( 'disconnect', () => { term.write( 'Only SuperUsers can use the terminal' ); } );
	}
}
</script>

<style scoped>
@import './../../../style/xterm.css';
</style>