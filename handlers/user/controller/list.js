'use strict';

// Dependencies
const app	= require( 'event_request' )();

/**
 * @brief	Renders the Users page
 */
app.get( '/users', async ( event ) =>{
	event.render( 'users' );
}, 'cache.request' );

/**
 * @brief	Returns all the usernames
 */
app.get( '/users/list', async ( event ) =>{
	event.send( Object.keys( event.userManager.users ) );
});
