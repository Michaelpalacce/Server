'use strict';

const { rename }		= require( 'fs' ).promises;
const fs				= require( 'fs' );
const path				= require( 'path' );
const copyFolder		= require( '../../../../main/utils/copyFolder' );
const forbiddenDirs		= require( "../../utils/forbidden_folders" );
const { itemInFolder }	= require( '../../utils/folders' );

/**
 * @brief	Model responsible for cutting, copying or renaming a Folder
 */
class MoveModel
{
	/**
	 * @param	{EventRequest} event
	 */
	constructor( event )
	{
		this.event	= event;
		this.user	= event.$user;
	}

	/**
	 * @brief	Cuts the given folder to a new place
	 *
	 * @param	{MoveInput} moveInput
	 *
	 * @return	{Promise<void>}
	 */
	cut( moveInput )
	{
		this._canPerformOperation( moveInput );
		const oldPath	= moveInput.getOldPath();
		const newPath	= moveInput.getNewPath();

		if ( newPath.includes( oldPath ) )
			throw { code: 'app.browse.move.recursionDetected', message: 'Possible recursion prevented' };

		if ( ! fs.existsSync( newPath ) )
			throw { code: 'app.browse.move.folderDoesNotExist', message: 'New path does not exist' };

		return rename( oldPath, path.join( newPath, path.parse( oldPath ).base ) );
	}

	/**
	 * @brief	Copies the given folder to a new place
	 *
	 * @param	{MoveInput} moveInput
	 *
	 * @return	{Promise<void>}
	 */
	copy( moveInput )
	{
		this._canPerformOperation( moveInput );

		const oldPath	= moveInput.getOldPath();
		const newPath	= moveInput.getNewPath();

		if ( newPath.includes( oldPath ) )
			throw { code: 'app.browse.move.recursionDetected', message: 'Possible recursion prevented' };

		if ( ! fs.existsSync( newPath ) )
			throw { code: 'app.browse.move.folderDoesNotExist', message: 'New path does not exist' };

		this.event.clearTimeout();

		return copyFolder( oldPath, path.join( newPath, path.parse( oldPath ).base ) );
	}

	/**
	 * @brief	Renames the given folder
	 *
	 * @param	{MoveInput} moveInput
	 *
	 * @return	{Promise<void>}
	 */
	rename( moveInput )
	{
		this._canPerformOperation( moveInput );

		const oldPath	= moveInput.getOldPath();
		const newPath	= moveInput.getNewPath();

		if ( fs.existsSync( newPath ) )
			throw { code: 'app.browse.move.folderExists', message: 'Folder already exists' };

		return rename( oldPath, newPath );
	}

	/**
	 * @brief	Checks if the current user has permissions to perform the operation
	 *
	 * @details	Returns void but throws in case of an error
	 *
	 * @param	{MoveInput} moveInput
	 *
	 * @return	void
	 */
	_canPerformOperation( moveInput )
	{
		if ( ! moveInput.isValid() )
			throw { code: 'app.input.invalidMoveInput', message : moveInput.getReasonToString() };

		const route		= this.user.getBrowseMetadata().getRoute();
		const oldPath	= moveInput.getOldPath();
		const newPath	= moveInput.getNewPath();

		for ( const forbiddenDir of forbiddenDirs )
			if ( itemInFolder( newPath, forbiddenDir, true )
				|| itemInFolder( oldPath, forbiddenDir, true )
				|| itemInFolder( forbiddenDir, oldPath, true )
			)
				throw { code: 'app.browse.move.unauthorized', message : `No permissions to access ${forbiddenDir}`, status: 403 };

		if ( ! itemInFolder( oldPath, route, true ) || ! itemInFolder( newPath, route, true ) )
			throw { code: 'app.browse.move.unauthorized', message : `No permissions to do operations on ${oldPath}` };

		if ( fs.statSync( oldPath ).isFile() )
			throw { code: 'app.browse.move.wrongCall', message : `Cannot do operations on a file: ${oldPath}` };
	}
}

module.exports	= MoveModel;
