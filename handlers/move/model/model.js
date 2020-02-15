'use strict';

const path	= require( 'path' );
const fs	= require( 'fs' );

const Model	= {};

/**
 * @brief	Validation for both the cut and copy routes
 *
 * @param	EventRequest event
 *
 * @returns	Boolean
 */
Model.validate	= function( event )
{
	return event.validationHandler.validate( event.body, { newPath: 'filled||string', oldPath: 'filled||string' } ).hasValidationFailed();
};

Model.cut	= function( event )
{
	if ( Model.validate( event ) )
		return event.sendError( 'Invalid body parameters passed', 400 );

	event.send( { message: 'ok' } );
};

Model.copy	= function( event )
{
	if ( Model.validate( event ) )
		return event.sendError( 'Invalid body parameters passed', 400 );

	event.send( { message: 'ok' } );
};

module.exports	= Model;
