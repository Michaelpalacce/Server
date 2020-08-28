'use strict';

const { rename }	= require( 'fs' ).promises;
const fs			= require( 'fs' );
const path			= require( 'path' );
const MoveInput		= require( '../input/move_input' );
const copyFolder	= require( '../../main/utils/copyFolder' );

const Model			= {};

/**
 * @brief	Moves the given item to a new path
 *
 * @param	{EventRequest} event
 *
 * @returns	mixed
 */
Model.cut	= async ( event ) => {
	const input		= new MoveInput( event );
	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( newPath.includes( oldPath ) )
		return event.send( 'Possible recursion prevented ( item may also have similar names )', 400 );

	if ( ! fs.existsSync( newPath ) )
		return event.send( 'New path does not exist', 400 );

	newPath	= path.join( newPath, path.parse( oldPath ).base );

	await rename( oldPath, newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

/**
 * @brief	Copies the given item to a new path
 *
 * @param	{EventRequest} event
 *
 * @returns	mixed
 */
Model.copy	= async ( event ) => {
	const input		= new MoveInput( event );
	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( newPath.includes( oldPath ) )
		return event.send( 'Possible recursion prevented ( item may also have similar names )', 400 );

	if ( ! fs.existsSync( newPath ) )
		return event.send( 'New path does not exist', 400 );

	newPath	= path.join( newPath, path.parse( oldPath ).base );

	event.clearTimeout();
	await copyFolder( oldPath, newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

/**
 * @brief	Renames the given item
 *
 * @param	{EventRequest} event
 *
 * @returns	mixed
 */
Model.rename	= async ( event ) => {
	const input		= new MoveInput( event );
	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( fs.existsSync( newPath ) )
		return event.send( 'Folder already exists', 400 );

	await rename( oldPath, newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

module.exports	= Model;
