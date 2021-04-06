'use strict';

const { rename, copyFile }	= require( 'fs' ).promises;
const fs					= require( 'fs' );
const path					= require( 'path' );

const PROJECT_ROOT			= path.parse( require.main.filename ).dir;

/**
 * @brief	Model responsible for cutting, copying or renaming a File
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
	 * @brief	Cuts the given File to a new place
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
			throw { code: 'app.browse.move.fileDoesNotExist', message: 'New path does not exist' };

		this.event.clearTimeout();

		return rename( oldPath, path.join( newPath, path.parse( oldPath ).base ) );
	}

	/**
	 * @brief	Copies the given File to a new place
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
			throw { code: 'app.browse.move.fileDoesNotExist', message: 'New path does not exist' };

		this.event.clearTimeout();

		return copyFile( oldPath, path.join( newPath, path.parse( oldPath ).base ) );
	}

	/**
	 * @brief	Renames the given File
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
			throw { code: 'app.browse.move.fileExists', message: 'File already exists' };

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

		const route				= this.user.getBrowseMetadata().getRoute();
		const oldPath			= moveInput.getOldPath();
		const newPath			= moveInput.getOldPath();
		const resolvedNewPath	= path.resolve( newPath );
		const resolvedOldPath	= path.resolve( oldPath );
		const resolvedRoute		= path.resolve( route );

		if ( resolvedNewPath.includes( PROJECT_ROOT ) || resolvedOldPath.includes( PROJECT_ROOT ) || PROJECT_ROOT.includes( resolvedOldPath ))
			throw { code: 'app.browse.move.unauthorized', message : `Cannot do operations to project ROOT ${PROJECT_ROOT}` };

		if ( ! resolvedOldPath.includes( resolvedRoute ) || ! resolvedNewPath.includes( resolvedRoute ) )
			throw { code: 'app.browse.move.unauthorized', message : `No permissions to do operations on ${resolvedOldPath}` };

		if ( fs.statSync( oldPath ).isDirectory() )
			throw { code: 'app.browse.move.wrongCall', message : `Cannot do operations on a directory: ${oldPath}` };
	}
}

module.exports	= MoveModel;
