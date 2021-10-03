'use strict';

const fs				= require( 'fs' );
const { unlink }		= fs.promises;
const forbiddenDirs		= require( '../../utils/forbidden_folders' );
const { itemInFolder }	= require( '../../utils/folders' );
const path				= require( 'path' );

/**
 * @brief	Model responsible for deleting files
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
	 * @brief	Deletes the given file if the user has permission to do so
	 *
	 * @param	{DeleteInput} deleteInput
	 *
	 * @return	{Promise<void>}
	 */
	async delete( deleteInput )
	{
		if ( ! deleteInput.isValid() )
			throw { code: 'app.input.invalidDeleteFileInput', message : deleteInput.getReasonToString() };

		const route		= this.user.getBrowseMetadata().getRoute();
		const item		= deleteInput.getItem();
		const itemName	= path.parse( item ).base;

		for ( const forbiddenDir of forbiddenDirs )
			if ( ! itemInFolder( item, route ) || itemInFolder( item, forbiddenDir ) )
				throw { code: 'app.browse.delete.unauthorized', message : { error: `Cannot delete items in forbidden folder: ${forbiddenDir}`, itemName }, status: 403 };

		if ( ! fs.existsSync( item ) )
			return ;

		if ( fs.statSync( item ).isDirectory() )
			throw { code: 'app.browse.delete.wrongCall', message : { error: `Trying to delete a directory`, itemName } };

		await unlink( deleteInput.getItem() ).catch(( error )=>{
			throw { code: 'app.browse.delete.failed', message : { error, itemName }, status: 500 };
		});
	}
}

module.exports	= DeleteModel;
