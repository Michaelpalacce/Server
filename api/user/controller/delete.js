'use strict';

// Dependencies
const app			= require( 'event_request' )();
const DeleteUserInput	= require( '../input/delete_user_input' );

/**
 * @brief	Deletes an existing user
 *
 * @details	Can only delete if current user is SU
 * 			Can not delete self
 */
app.delete( '/users/:username:', async ( event ) => {
	const userManager	= event.userManager;
	const input			= new DeleteUserInput( event, userManager );

	if ( ! input.isValid() )
		return event.next( `Invalid input params: ${input.getReasonToString()}`, 400 );

	userManager.delete( input.getUsername() );

	event.send( 'ok' );
});
