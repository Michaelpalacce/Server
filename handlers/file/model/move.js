'use strict';

const fs		= require( 'fs' );
const util		= require( 'util' );
const path		= require( 'path' );
const MoveInput	= require( '../input/move_input' );

const rename	= util.promisify( fs.rename );
const copy		= util.promisify( fs.copyFile );

const Model		= {};

/**
 * @brief	Moves the given item to a new path
 *
 * @param	{EventRequest} event
 *
 * @returns	void
 */
Model.cut	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath		= input.getOldPath();
	let newPath			= input.getNewPath();

	const oldPathParsed	= path.parse( oldPath );

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	event.clearTimeout();
	rename( oldPath, newPath ).then(() => {
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	}).catch( event.next );
};

/**
 * @brief	Copies the given item to a new path
 *
 * @param	{EventRequest} event
 *
 * @returns	void
 */
Model.copy	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath		= input.getOldPath();
	let newPath			= input.getNewPath();

	const oldPathParsed	= path.parse( oldPath );

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	event.clearTimeout();
	copy( oldPath, newPath ).then(() => {
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	}).catch( event.next );
};

/**
 * @brief	Renames the given item
 *
 * @param	{EventRequest} event
 *
 * @returns	void
 */
Model.rename	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath	= input.getOldPath();
	let newPath	= input.getNewPath();

	if ( fs.existsSync( newPath ) )
	{
		return event.send( 'File already exists', 400 );
	}

	rename( oldPath, newPath ).then(() => {
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	}).catch( event.next );
};

module.exports	= Model;
