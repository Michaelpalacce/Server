'use strict';

const app					= require( 'event_request' )();
const Acl					= require( '../../../main/acls/acl' );
const { formatPermissions }	= require( '../../../main/acls/permissions_helper' );
const DeleteRoleInput		= require('../input/delete_role_input');
const NewRoleInput			= require( '../input/new_role_input' );
const UpdateRoleInput		= require('../input/update_role_input');
const RolesModel			= require( '../model/roles' );
const router				= app.Router();

/**
 * @brief	Adds a new route `/api/users/roles` with method GET which returns all the roles and their permissions
 *
 * @details	No Optional or required params
 *
 * @return	void
 */
router.get( '/users/roles', ( event ) => {
	event.send( formatPermissions( Acl.getRoles() ) );
});

/**
 * @brief	Adds a new route `/api/users/:roleName:` with method delete which will delete the given role
 *
 * @return	void
 */
router.delete( '/users/role/:roleName:', ( event ) => {
	const input	= new DeleteRoleInput( event );
	const model	= new RolesModel();
	model.deleteRole( input );

	event.send();
});

/**
 * @brief	Adds a new route `/api/users/:roleName:` with method PUT which will update a given role
 *
 * @return	void
 */
router.put( '/users/role/:roleName:', async ( event ) => {
	const input	= new UpdateRoleInput( event );
	const model	= new RolesModel();
	await model.updateRole( input );

	event.send();
});

/**
 * @brief	Adds a new route `/api/users/role` with method POST which is used to add new roles
 *
 * @details	body: {
 * 				role: {
 * 					name		: 'filled||string',
 * 					permissions	: [
 * 						{
 * 							type: 'filled||string',
 * 							method: 'filled||string',
 * 							route: 'filled||string',
 * 						},
 * 					],
 * 				}
 * 			}
 *
 * @return	void
 */
router.post( '/users/role', async ( event ) => {
	const input	= new NewRoleInput( event );
	const model	= new RolesModel();

	await model.addRole( input ).catch( event.next );

	event.send( Buffer.from( '' ), 201 );
});

module.exports	= router;