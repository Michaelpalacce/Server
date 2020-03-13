'use strict';

const fs		= require( 'fs' );
const util		= require( 'util' );
const path		= require( 'path' );

const rename	= util.promisify( fs.rename );
const ncp		= require('ncp').ncp;

const Model		= {};

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

	if ( newPath.substring( 0, oldPath.length ) === oldPath )
	{
		return event.send( 'I just saved your HDD/SSD', 400 );
	}

	const fileStats				= fs.statSync( oldPath );
	const oldPathParsed			= path.parse( oldPath );

	if ( fileStats.isFile() )
	{
		return event.send( 'Cannot cut files', 400 );
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

	if ( newPath.substring( 0, oldPath.length ) === oldPath )
	{
		return event.send( 'I just saved your HDD/SSD', 400 );
	}

	const fileStats				= fs.statSync( oldPath );
	const oldPathParsed			= path.parse( oldPath );

	if ( fileStats.isFile() )
	{
		return event.send( 'Cannot copy Files', 400 );
	}

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	event.clearTimeout();
	ncp( oldPath, newPath, ( err )=>{
		if ( err )
		{
			return event.sendError( err );
		}

		event.send( { newPath } );
	});
};

/**
 * @brief	Renames the given item
 *
 * @param	EventRequest event
 *
 * @returns	void
 */
Model.rename	= function( event )
{
	const result	= Model.validate( event );

	if ( result.hasValidationFailed() )
		return event.sendError( 'Invalid body parameters passed', 400 );

	let { newPath, oldPath }	= result.getValidationResult();
	newPath						= decodeURIComponent( newPath );
	oldPath						= decodeURIComponent( oldPath );

	const fileStats				= fs.statSync( oldPath );

	if ( fileStats.isFile() )
	{
		return event.send( 'Cannot rename files', 400 );
	}

	if ( fs.existsSync( newPath ) )
	{
		return event.send( 'Folder already exists', 400 );
	}

	rename( oldPath, newPath ).then(()=>{
		event.send( { newPath } );
	}).catch( event.next );
};

module.exports	= Model;
