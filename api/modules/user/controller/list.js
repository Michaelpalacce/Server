'use strict';

const app		= require( 'event_request' )();
const UserModel	= require( '../model/user' );

/**
 * @brief	Adds a new route `/users`
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
app.get( '/users', ( event ) => {
	const model	= new UserModel( event );

	event.send( model.getAllUsers() );
});