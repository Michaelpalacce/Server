'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

/**
 * @brief	Updates a user
 */
app.patch( '/users/:username:', ( event ) =>{
	if ( event.session.get( 'SU' ) === false )
	{
		return event.sendError( 'Only super users can update users', 400 );
	}

	const userManager	= event.userManager;
	const params		= event.validationHandler.validate( event.params, { username : 'filled||string||range:3-64' } );
	const result		= event.validationHandler.validate( event.body,
		{
			password	: 'filled||string||range:3-64',
			isSU		: 'filled||boolean',
			route		: 'filled||string'
		}
	);

	if ( result.hasValidationFailed() )
	{
		return event.sendError( `There is an error: ${JSON.stringify( result.getValidationResult() )}`, 400 )
	}

	if ( params.hasValidationFailed() )
	{
		return event.sendError( `There is an error: ${JSON.stringify( params.hasValidationFailed() )}`, 400 )
	}

	const { username }	= params.getValidationResult();

	if ( ! userManager.has( username ) )
	{
		return event.sendError( `User: ${username} does not exists`, 400 )
	}

	const userData		= result.getValidationResult();
	userData.route		= decodeURIComponent( userData.route );

	userManager.update( username, userData );

	event.send( 'ok' );
});
