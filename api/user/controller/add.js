'use strict';

// Dependencies
const app				= require( 'event_request' )();
const AddUserInput		= require( '../input/add_user_input' );

const bodyValidation	= {
	username	: 'filled||string||range:3-64',
	permissions	: 'filled||string',
	password	: 'filled||string||range:3-64',
	isSU		: 'filled||boolean',
	route		: 'filled||string'
};

/**
 * @brief	Adds a new user
 */
app.post( '/users/add', app.er_validation.validate( { body: bodyValidation } ),( event ) => {
	const userManager	= event.userManager;
	const input			= new AddUserInput( event, userManager );

	if ( ! input.isValid() )
		return event.next( `Invalid input params: ${input.getReasonToString()}`, 400 );

	userManager.set( input.getUserData() );

	event.send( 'ok' );
});
