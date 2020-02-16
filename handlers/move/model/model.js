'use strict';

const fs			= require( 'fs' );
const util			= require( 'util' );
const path			= require( 'path' );

const rename		= util.promisify( fs.rename );
const copy			= util.promisify( fs.copyFile );

const Model	= {};

/**
 * @brief	Validation for both the cut and copy routes
 *
 * @param	EventRequest event
 *
 * @returns	ValidationResult
 */
Model.validate	= function( event )
{
	return event.validationHandler.validate( event.body, { newPath: 'filled||string', oldPath: 'filled||string' } );
};

/**
 * @brief	Moves the given item to a new path
 *
 * @param	EventRequest event
 *
 * @returns	void
 */
Model.cut	= function( event )
{
	const result	= Model.validate( event );

	if ( result.hasValidationFailed() )
		return event.sendError( 'Invalid body parameters passed', 400 );

	let { newPath, oldPath }	= result.getValidationResult();
	newPath						= decodeURIComponent( newPath );
	oldPath						= decodeURIComponent( oldPath );

	const fileStats				= fs.statSync( oldPath );
	const oldPathParsed			= path.parse( oldPath );

	if ( fileStats.isDirectory() )
	{
		return event.send( 'Cannot cut Folders yet', 400 );
	}

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	rename( oldPath, newPath ).then(()=>{
		event.send( { newPath } );
	}).catch( event.next );
};

/**
 * @brief	Copies the given item to a new path
 *
 * @param	EventRequest event
 *
 * @returns	void
 */
Model.copy	= function( event )
{
	const result	= Model.validate( event );

	if ( result.hasValidationFailed() )
		return event.sendError( 'Invalid body parameters passed', 400 );

	let { newPath, oldPath }	= result.getValidationResult();
	newPath						= decodeURIComponent( newPath );
	oldPath						= decodeURIComponent( oldPath );


	const fileStats				= fs.statSync( oldPath );
	const oldPathParsed			= path.parse( oldPath );

	if ( fileStats.isDirectory() )
	{
		return event.send( 'Cannot cut Folders yet', 400 );
	}

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	copy( oldPath, newPath ).then(()=>{
		event.send( { newPath } );
	}).catch( event.next );
};

module.exports	= Model;
