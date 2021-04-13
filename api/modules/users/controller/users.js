'use strict';

const app				= require( 'event_request' )();
const UsersModel			= require( '../model/users' );
const GetUserInput		= require( '../input/get_user_input' );
const UpdateUserInput	= require( '../input/update_user_input' );
const DeleteUserInput	= require( '../input/delete_user_input' );
const CreateUserInput	= require( '../input/create_user_input' );
const router			= app.Router();

/**
 * @brief	Adds a new route `/api/users/:username:/data` with method GET
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
router.get( '/users/:username:/data', ( event ) => {
	const input	= new GetUserInput( event );
	const model	= new UsersModel( event );
	const user	= model.getUser( input );

	event.send( user.getUserData() );
});

/**
 * @brief	Adds a new route `/api/users/:username:/update` with method PATCH
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
router.patch( '/users/:username:/update', ( event ) => {
	const input	= new UpdateUserInput( event );
	const model	= new UsersModel( event );
	const user	= model.updateUser( input );

	event.send( user.getUserData() );
});

/**
 * @brief	Adds a new route `/api/users/:username:/delete` with method DELETE
 *
 * @details	No Optional or required params
 * 			The username parameter will be set to whatever was passed
 *
 * @return	void
 */
router.delete( '/users/:username:/delete', ( event ) => {
	const input	= new DeleteUserInput( event );
	const model	= new UsersModel( event );
	model.deleteUser( input );

	event.send();
});

/**
 * @brief	Adds a new route `/api/users/create` with method POST
 *
 * @details	Required Body Params: username, password
 *
 * @return	void
 */
router.post( '/users/create', ( event ) => {
	const input	= new CreateUserInput( event );
	const model	= new UsersModel( event );

	event.send( model.createUser( input ).getUserData() );
});

module.exports	= router;