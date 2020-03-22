'use strict';

const fs		= require( 'fs' );
const util		= require( 'util' );
const path		= require( 'path' );
const MoveInput	= require( '../input/move_input' );

const rename	= util.promisify( fs.rename );
const ncp		= require('ncp').ncp;

const Model		= {};

/**
 * @brief	Moves the given item to a new path
 *
 * @param	EventRequest event
 *
 * @returns	mixed
 */
Model.cut	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath		= input.getOldPath();
	let newPath			= input.getNewPath();

	const oldPathParsed	= path.parse( oldPath );

	if ( newPath.includes( oldPath ) )
	{
		return event.send( 'Possible recursion prevented ( item may also have similar names )', 400 );
	}

	if ( ! fs.existsSync( newPath ) )
	{
		return event.send( 'New path does not exist', 400 );
	}

	newPath	= path.join( newPath, oldPathParsed.base );

	rename( oldPath, newPath ).then(()=>{
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	}).catch( event.next );
};

/**
 * @brief	Copies the given item to a new path
 *
 * @param	EventRequest event
 *
 * @returns	mixed
 */
Model.copy	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath		= input.getOldPath();
	let newPath			= input.getNewPath();

	const oldPathParsed	= path.parse( oldPath );

	if ( newPath.includes( oldPath ) )
	{
		return event.send( 'Possible recursion prevented ( item may also have similar names )', 400 );
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
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	});
};

/**
 * @brief	Renames the given item
 *
 * @param	EventRequest event
 *
 * @returns	mixed
 */
Model.rename	= function( event )
{
	const input	= new MoveInput( event );

	if ( ! input.isValid() )
		return event.sendError( `Invalid input: ${input.getReasonToString()}`, 400 );

	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( fs.existsSync( newPath ) )
	{
		return event.send( 'Folder already exists', 400 );
	}

	rename( oldPath, newPath ).then(()=>{
		newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
		event.send( { newPath } );
	}).catch( event.next );
};

module.exports	= Model;
