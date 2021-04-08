'use strict';

const app			= require( 'event_request' )();
const UserModel		= require( '../model/user' );
const GetUserInput	= require( '../input/get_user_input' );

/**
 * @brief	Adds a new route `/users/:username:`
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
app.get( '/users/:username:', ( event ) => {
	const input	= new GetUserInput( event );
	const model	= new UserModel( event );
	const user	= model.getUser( input );

	event.send( user.getUserData() );
});
