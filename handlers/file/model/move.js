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
Model.cut	= async ( event ) => {
	const input		= new MoveInput( event );
	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( ! fs.existsSync( newPath ) )
		return event.send( 'New path does not exist', 400 );

	newPath	= path.join( newPath, path.parse( oldPath ).base );

	event.clearTimeout();
	await rename( oldPath, newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

/**
 * @brief	Copies the given item to a new path
 *
 * @param	{EventRequest} event
 *
 * @returns	void
 */
Model.copy	= async ( event ) => {
	const input		= new MoveInput( event );
	const oldPath	= input.getOldPath();
	let newPath		= input.getNewPath();

	if ( ! fs.existsSync( newPath ) )
		return event.send( 'New path does not exist', 400 );

	newPath	= path.join( newPath, path.parse( oldPath ).base );

	event.clearTimeout();
	await copy( oldPath, newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

/**
 * @brief	Renames the given item
 *
 * @param	{EventRequest} event
 *
 * @returns	void
 */
Model.rename	= async ( event ) => {
	const input	= new MoveInput( event );
	let newPath	= input.getNewPath();

	if ( fs.existsSync( newPath ) )
		return event.send( 'File already exists', 400 );

	await rename( input.getOldPath(), newPath ).catch( event.next );

	newPath	= encodeURIComponent( Buffer.from( newPath ).toString( 'base64' ) );
	event.send( { newPath } );
};

module.exports	= Model;
