'use strict';

// Dependencies
const app		= require( 'event_request' )();

const MoveModel	= require( '../model/move' );
const MoveInput	= require( '../input/move_input' );

const router	= app.Router();

/**
 * @brief	Adds a '/api/browse/file/copy' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/file/copy',  async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.copy( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/api/browse/file/cut' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/file/cut', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.cut( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/api/browse/file/rename' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/file/rename', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.rename( input ).catch( event.next );

	event.send();
});


module.exports	= router;