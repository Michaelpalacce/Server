'use strict';

const path			= require( 'path' );
const fs			= require( 'fs' );
const archiver		= require( 'archiver' );
const forbiddenDirs	= require( '../../utils/forbidden_folders' );

/**
 * @brief	Model responsible for downloading one or more items if the user has permission to access them
 */
class DownloadModel
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
	 * @brief	Downloads one or more items
	 *
	 * @details	Works with both files and folders
	 * 			This method will return a response to the client
	 *
	 * @param	{DownloadInput} downloadInput
	 *
	 * @return	void
	 */
	downloadItems( downloadInput )
	{
		if ( ! downloadInput.isValid() )
			throw { code: 'app.input.invalidDownloadInput', message : downloadInput.getReasonToString() };

		const items	= downloadInput.getItems();

		this.event.clearTimeout();

		const archive		= archiver( 'zip', { zlib: { level: 9 } } );
		const firstItem		= items[0];
		const parsedItem	= path.parse( firstItem );

		if ( items.length === 1 )
		{
			const stats		= fs.statSync( firstItem );
			const fileName	= parsedItem.base.replace( '/', '' );

			this._hasPermission( firstItem );

			if ( stats.isDirectory() )
			{
				archive.pipe( this.event.response );
				this.event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}.zip"` );
				this.event.setResponseHeader( 'Content-type', 'zip' );

				try
				{
					archive.directory( firstItem, false );
					archive.finalize();
				}
				catch ( e )
				{
					this._downloadFailedCallback();
				}
			}
			else
			{
				this.event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}"` );
				this.event.setResponseHeader( 'Content-type', parsedItem.ext );
				this.event.setResponseHeader( 'Content-Length', stats.size );

				try
				{
					fs.createReadStream( firstItem ).pipe( this.event.response );
				}
				catch ( e )
				{
					this._downloadFailedCallback();
				}
			}

			return;
		}

		this.event.setResponseHeader( 'content-disposition', `attachment; filename="${parsedItem.dir === '/' ? 'ROOT' : path.parse( parsedItem.dir ).base}.zip"` );
		this.event.setResponseHeader( 'Content-type', 'zip' );

		archive.pipe( this.event.response );

		for ( const item of items )
		{
			this._hasPermission( firstItem );
			const parsedItem	= path.parse( item );
			const stats			= fs.statSync( item );

			try
			{
				stats.isDirectory() ? archive.directory( item, false ) : archive.file( item, { name: parsedItem.base } );
			}
			catch ( e )
			{
				this._downloadFailedCallback();
			}
		}

		archive.finalize();
	}

	/**
	 * @brief	Callback called when downloading a file fails
	 *
	 * @param	{String} text
	 *
	 * @return	void
	 */
	_downloadFailedCallback( text = 'The file specified does not exist' )
	{
		this.event.setResponseHeader( 'Content-disposition', 'attachment; filename="error.log"' );
		this.event.setResponseHeader( 'Content-type', '.log' );

		this.event.send( text );
	};

	/**
	 * @brief	Checks if the user has permission to access the given directory
	 *
	 * @details	Returns nothing but will throw if there is an error
	 *
	 * @param	{String} itemName
	 *
	 * @return	void
	 */
	_hasPermission( itemName )
	{
		try
		{
			fs.statSync( itemName );
		}
		catch ( e )
		{
			throw { code: 'app.browse.download.itemDoesNotExist', message: `${itemName} does not exist` }
		}

		const route			= this.user.getBrowseMetadata().getRoute();
		const resolvedItem	= path.resolve( itemName );
		const resolvedRoute	= path.resolve( route );

		for ( const forbiddenDir of forbiddenDirs )
			if ( ! resolvedItem.includes( resolvedRoute ) || resolvedItem.includes( path.resolve( forbiddenDir ) ) )
				throw { code: 'app.browse.download.unauthorized', message : `No permissions to access ${resolvedItem}`, status: 403 };
	}
}

module.exports	= DownloadModel;
