
const { Server }	= require( 'event_request' );
const app			= Server();

app.post( '/user', async ( event ) =>{
	// event.render( 'users', {} );
});
