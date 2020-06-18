'use strict';

// Dependencies
const app	= require( 'event_request' )();

app.get( '/terminal', ( event )=>{
	event.render( 'terminal' )
}, 'cache.request' );
