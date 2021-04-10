'use strict';

const app					= require( 'event_request' )();
const Acl					= require( '../../../main/acls/acl' );
const { formatPermissions }	= require( '../../../main/acls/permissions_helper' );

/**
 * @brief	Adds a new route `/users/roles` with method GET which returns all the roles and their permissions
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
app.get( '/users/roles', ( event ) => {
	event.send( formatPermissions( Acl.getRoles() ) );
});