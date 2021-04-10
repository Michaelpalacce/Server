'use strict';

const app				= require( 'event_request' )();
const UserModel			= require( '../model/user' );
const GetUserInput		= require( '../input/get_user_input' );
const UpdateUserInput	= require( '../input/update_user_input' );

/**
 * @brief	Adds a new route `/users/:username:/data` with method GET
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
app.get( '/users/:username:/data', ( event ) => {
	const input	= new GetUserInput( event );
	const model	= new UserModel( event );
	const user	= model.getUser( input );

	event.send( user.getUserData() );
});

/**
 * @brief	Adds a new route `/users/:username:/update` with method PATCH
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
app.patch( '/users/:username:/update', ( event ) => {
	const input	= new UpdateUserInput( event );
	const model	= new UserModel( event );
	const user	= model.updateUser( input );

	event.send( user.getUserData() );
});
