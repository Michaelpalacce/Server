'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );
const path	= require( 'path' );
const fs	= require( 'fs' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteInput extends Input
{
	/**
	 * @brief	Returns the item to be deleted
	 *
	 * @returns	mixed
	 */
	getItem()
	{
		return this.get( DeleteInput.ITEM_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		if ( ! this.event.session.has( 'route' ) || ! this.event.session.has( 'SU' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		const isSU			= this.event.session.get( 'SU' );
		const route			= this.event.session.get( 'route' );

		let { item }		= this.event.query;
		item				= Buffer.from( decodeURIComponent( item ), 'base64' ).toString();

		const resolvedItem	= path.resolve( item );
		const resolvedRoute	= path.resolve( route );

		if ( resolvedItem.includes( PROJECT_ROOT ) )
		{
			this.reason	= `Cannot delete files in project ROOT ${PROJECT_ROOT}`;
			return false;
		}

		if ( ! isSU && ! resolvedItem.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to delete ${resolvedItem}`;
			return false;
		}

		if ( ! fs.existsSync( item ) )
		{
			this.reason	= `Item does not exist: ${resolvedItem}`;
			return false;
		}

		if ( fs.statSync( item ).isDirectory() )
		{
			this.reason	= `Trying to delete directory: ${resolvedItem}`;
			return false;
		}

		this.model[DeleteInput.ITEM_KEY]	= item;

		return true;
	}
}

DeleteInput.ITEM_KEY	= 'item';

module.exports	= DeleteInput;