'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

/**
 * @brief	Gets information about the user
 */
app.get( '/users/:username:', async ( event ) =>{
	const userManager	= event.userManager;
	const result		= event.validationHandler.validate( event.params,
		{
			username	: 'filled||string||range:3-64'
		}
	);

	if ( result.hasValidationFailed() )
	{
		return event.sendError( `There is an error: ${JSON.stringify( result.getValidationResult() )}`, 400 )
	}

	const { username }	= result.getValidationResult();

	if ( event.session.get( 'SU' ) === false && event.session.get( 'username' ) !== username )
	{
		return event.sendError( 'Only super users can view other users', 400 );
	}

	event.send( userManager.get( username ).getUserData() );
});
