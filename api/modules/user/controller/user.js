'use strict';

const app					= require( 'event_request' )();
const UserModel				= require( '../model/user' );
const ChangePasswordInput	= require( '../input/change_password_input' );

/**
 * @brief	Adds a new route `/api/user` with method DELETE
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
app.delete( '/api/user', async ( event ) => {
	const model	= new UserModel( event );
	await model.deleteUser();

	event.send();
});

/**
 * @brief	Adds a new route `/api/user/password` with method PUT
 *
 * @details	Required body param: password
 *
 * @return	void
 */
app.put( '/api/user/password', async ( event ) => {
	const model	= new UserModel( event );
	const input	= new ChangePasswordInput( event );
	model.changePassword( input );

	event.send();
});
