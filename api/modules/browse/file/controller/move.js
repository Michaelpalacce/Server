'use strict';

// Dependencies
const app		= require( 'event_request' )();

const MoveModel	= require( '../model/move' );
const MoveInput	= require( '../input/move_input' );

/**
 * @brief	Adds a '/api/file/copy' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/api/file/copy',  async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.copy( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/api/file/cut' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/api/file/cut', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.cut( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/api/file/rename' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/api/file/rename', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.rename( input ).catch( event.next );

	event.send();
});
