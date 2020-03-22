'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();
const AddUserInput	= require( '../input/add_user_input' );

/**
 * @brief	Adds a new user
 */
app.post( '/users/add', ( event ) =>{
	const userManager	= event.userManager;
	const input			= new AddUserInput( event, userManager );

	if ( ! input.isValid() )
		return event.next( `Invalid input params: ${input.getReasonToString()}`, 400 );

	userManager.set( input.getUserData() );

	event.send( 'ok' );
});
