
const { Server }	= require( 'event_request' );
const app			= Server();

/**
 * @brief	Deletes an existing user
 *
 * @details	Can only delete if current user is SU
 * 			Can not delete self
 */
app.delete( '/users/:username:', async ( event ) =>{
	if ( event.session.get( 'SU' ) === false )
	{
		return event.sendError( 'Only super users can delete other users', 400 );
	}

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

	if ( event.session.get( 'username' ) === username )
	{
		return event.sendError( 'Cannot delete self!', 400 );
	}

	userManager.delete( username );

	event.send( 'ok' );
});
