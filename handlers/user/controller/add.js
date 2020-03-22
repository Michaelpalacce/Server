'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const app			= Server();

/**
 * @brief	Adds a new user
 */
app.post( '/users/add', ( event ) =>{
	if ( event.session.get( 'SU' ) === false )
	{
		return event.sendError( 'Only super users can add other users', 400 );
	}

	const userManager	= event.userManager;
	const result		= event.validationHandler.validate( event.body,
		{
			username	: 'filled||string||range:3-64',
			password	: 'filled||string||range:3-64',
			isSU		: 'filled||boolean',
			route		: 'filled||string'
		}
	);

	if ( result.hasValidationFailed() )
	{
		return event.sendError( `There is an error: ${JSON.stringify( result.getValidationResult() )}`, 400 )
	}

	const { username }	= result.getValidationResult();

	if ( userManager.has( username ) )
	{
		return event.sendError( `User: ${username} already exists`, 400 )
	}

	const userData	= result.getValidationResult();
	userData.route	= Buffer.from( decodeURIComponent( userData.route ), 'base64' ).toString();

	userManager.set( userData );

	event.send( 'ok' );
});
