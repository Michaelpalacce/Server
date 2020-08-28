'use strict';

// Dependencies
const app			= require( 'event_request' )();
const GetUserInput	= require( '../input/get_user_input' );

/**
 * @brief	Gets information about the user
 */
app.get( '/users/:username:', async ( event ) => {
	const userManager	= event.userManager;
	const input			= new GetUserInput( event, userManager );

	if ( ! input.isValid() )
		return event.next( `Invalid input params: ${input.getReasonToString()}`, 400 );

	event.send( userManager.get( input.getUsername() ).getUserData() );
});
