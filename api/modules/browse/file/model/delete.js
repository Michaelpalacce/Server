'use strict';

const fs			= require( 'fs' );
const { unlink }	= fs.promises;
const path			= require( 'path' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

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

		const route			= this.user.getBrowseMetadata().getRoute();
		const item			= deleteInput.getItem();
		const itemName		= path.parse( item ).base;
		const resolvedItem	= path.resolve( item );
		const resolvedRoute	= path.resolve( route );

		if ( ! resolvedItem.includes( resolvedRoute ) || resolvedItem.includes( PROJECT_ROOT ) )
			throw { code: 'app.browse.delete.unauthorized', message : itemName, status: 403 };

		if ( ! fs.existsSync( item ) )
			throw { code: 'app.browse.delete.fileMissing', message : itemName };

		if ( fs.statSync( item ).isDirectory() )
			throw { code: 'app.browse.delete.wrongCall', message : itemName };

		await unlink( deleteInput.getItem() ).catch(( error )=>{
			throw { code: 'app.browse.delete.failed', message : error, status: 500 };
		});
	}
}

module.exports	= DeleteModel;
