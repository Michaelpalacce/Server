'use strict';

const path				= require( 'path' );
const fs				= require( 'fs' );
const forbiddenDirs		= require( '../../utils/forbidden_folders' );
const { itemInFolder }	= require( '../../utils/folders' );

/**
 * @brief	Class responsible for deletion of folders
 */
class DeleteModel
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
	 * @brief	Deletes the given folder
	 *
	 * @details	This function will check if the current user has permissions to delete the folder
	 * 			This function will check what you are trying to delete (cannot delete project root or root dir)
	 *
	 * @param	{DeleteInput} deleteInput
	 *
	 * @return	void
	 */
	delete( deleteInput )
	{
		if ( ! deleteInput.isValid() )
			throw { code: 'app.input.invalidDeleteInput', message : deleteInput.getReasonToString() };

		const directory	= deleteInput.getDirectory();
		const itemName	= path.parse( directory ).base;
		const route		= this.user.getBrowseMetadata().getRoute();

		for ( const forbiddenDir of forbiddenDirs )
			if ( itemInFolder( directory, forbiddenDir, true ) || itemInFolder( forbiddenDir, directory, true ) )
				throw { code: 'app.browse.delete.projectRoot', message : { error: `Cannot perform delete on ${directory}`, itemName } };

		if ( ! itemInFolder( directory, route, true ) || directory === '/' )
			throw { code: 'app.browse.delete.unauthorized', message : { error: `No permissions to delete item`, itemName } };

		if ( ! fs.existsSync( directory ) )
			return;

		if ( ! fs.statSync( directory ).isDirectory() )
			throw { code: 'app.browse.delete.wrongCall', message : { error: `Trying to delete a file`, itemName } };

		this._deleteFolderRecursive( directory );
	}

	/**
	 * @brief	Removes a folder recursively
	 *
	 * @param	{String} dir
	 *
	 * @return	void
	 */
	_deleteFolderRecursive( dir )
	{
		if ( fs.existsSync( dir ) )
		{
			fs.readdirSync( dir ).forEach( ( file ) => {
				const curPath	= path.join( dir, file );
				if ( fs.lstatSync( curPath ).isDirectory() )
					this._deleteFolderRecursive( curPath );
				else
					fs.unlinkSync( curPath );
			});

			fs.rmdirSync( dir );
		}
	};
}

module.exports	= DeleteModel;
