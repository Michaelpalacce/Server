'use strict';

// Dependencies
const { Server }		= require( 'event_request' );
const UpdateUserInput	= require( '../input/update_user_input' );
const app				= Server();

/**
 * @brief	Updates a user
 */
app.patch( '/users/:username:', ( event ) =>{
	const userManager	= event.userManager;
	const input			= new UpdateUserInput( event, userManager );

	if ( ! input.isValid() )
		return event.next( `Invalid input params: ${input.getReasonToString()}`, 400 );

	userManager.update( input.getUsername(), input.getUserData() );

	event.send( 'ok' );
});
