'use strict';

// Dependencies
const app		= require( 'event_request' )();

const MoveModel	= require( '../model/move' );
const MoveInput	= require( '../input/move_input' );

/**
 * @brief	Adds a '/folder/copy' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder/copy',  async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.copy( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/folder/cut' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder/cut', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.cut( input ).catch( event.next );

	event.send();
});

/**
 * @brief	Adds a '/folder/rename' route with method POST
 *
 * @param	{EventRequest} event
 *
 * @details	Required Parameters: newPath, oldPath
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder/rename', async ( event ) => {
	const input	= new MoveInput( event );
	const model	= new MoveModel( event );

	await model.rename( input ).catch( event.next );

	event.send();
});
