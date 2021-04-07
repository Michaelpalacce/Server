'use strict';

const app		= require( 'event_request' )();
const ListModel	= require( '../model/list' );

/**
 * @brief	Adds a new route `/users`
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
app.get( '/users', ( event ) => {
	const model	= new ListModel( event );

	event.send( model.getAllUsers() );
});