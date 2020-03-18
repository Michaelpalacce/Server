const { Server }	= require( 'event_request' );

const app			= Server();

app.get( '/terminal', ( event )=>{
	event.render( 'terminal', {} )
});