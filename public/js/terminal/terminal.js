'use strict';

/**
 * @brief	Display a message if socket.io does not exist
 */
$.ajax( '/socket.io/socket.io.js', {
		error	: ()=>{
			$( '#terminal-404' ).show();
		}
	}
);

/**
 * @brief	Gets a cookie
 *
 * @param	name String
 *
 * @return	String
 */
function getCookie( name )
{
	name	+= '=';

	const decodedCookie	= decodeURIComponent( document.cookie );
	const cookies		= decodedCookie.split( ';' );

	for( let i = 0; i < cookies.length; i ++ )
	{
		let cookie	= cookies[i];

		while ( cookie.charAt( 0 ) == ' ' )
		{
			cookie	= cookie.substring( 1 );
		}

		if ( cookie.indexOf( name ) == 0 )
		{
			return cookie.substring( name.length, cookie.length );
		}
	}

	return '';
}

const term		= new Terminal();
const socket	= io({
	transportOptions: {
		polling: {
			extraHeaders: {
				sid: getCookie( 'sid' )
			}
		}
	}
});

// Initialize the terminal
term.open( document.getElementById( 'terminal' ) );

// Log Connect/Disconnect
socket.on( 'connect', ()=>{
	console.log( 'Connected to server' );

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
});
socket.on( 'disconnect', ()=>{
	term.write( 'Only SuperUsers can use the terminal' );
	console.log( 'Disconnected from server' );
});
