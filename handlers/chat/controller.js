'use strict';

const { Server }	= require( 'event_request' );

const router		= Server().Router();

/**
 * @brief	Adds a '/chat/:user:' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/chat/:user:', ( event )=>{
	let result	= event.validationHandler.validate( event.params, { 'user' : 'filled||string' } );
	if ( result.hasValidationFailed() )
	{
		event.error( 'Error, specify user' );
		return;
	}
	result		= result.getValidationResult();
	const User	= event.cachingServer.model( 'User' );

	User.find( result.user ).then( ( model )=>{
		if ( model === null )
		{
			event.error( 'User not found' );
			return;
		}

		event.send( { message	: `You have requested to connect with ${model.recordName}`} );
	}).catch( event.next );

	event.send( { message	: `You have requested to connect with ${result.user}`} );
} );

module.exports	= router;