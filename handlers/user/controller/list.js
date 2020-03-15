
const { Server }	= require( 'event_request' );
const app			= Server();

app.get( '/users', async ( event ) =>{
	event.render( 'users', {} );
});

app.get( '/users/list', async ( event ) =>{
	event.send( Object.keys( event.userManager.users ) );
});
