'use strict';

const app			= require( 'event_request' )();
const UsersModel	= require( '../model/users' );
const router		= app.Router();

/**
 * @brief	Adds a new route `/api/users`
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
router.get( '/users', ( event ) => {
	const model	= new UsersModel( event );

	event.send( model.getAllUsers() );
});

module.exports	= router;