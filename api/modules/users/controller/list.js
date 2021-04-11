'use strict';

const app		= require( 'event_request' )();
const UsersModel	= require( '../model/users' );

/**
 * @brief	Adds a new route `/api/users`
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
app.get( '/api/users', ( event ) => {
	const model	= new UsersModel( event );

	event.send( model.getAllUsers() );
});