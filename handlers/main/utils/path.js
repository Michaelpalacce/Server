'use strict';

// Dependencies
const { FileStream }		= require( 'event_request' ).Development;
const path					= require( 'path' );
const fs					= require( 'fs' );

const getRootDir			= () => path.parse( process.cwd() ).root;
const BACK_ITEM_TEXT		= 'BACK';
const DIRECTORY_ITEMS_TYPE	= 'directory';
const PAGE_SIZE				= 50;

/**
 * @brief	Path helper used to retrieve data about files and folders
 *
 * @TODO	This file is disgusting in how it works, please save my soul and refactor this
 */
class PathHelper
{
	/**
	 * @brief	Accepts the abs file name as an argument
	 *
	 * @param	EventRequest event
	 * @param	String file
	 *
	 * @return	FileStream|null
	 */
	static getFileStreamerForFile( event, absItemName )
	{
		const fileStream	= event.fileStreamHandler.getFileStreamerForType( absItemName );

		if ( fileStream !== null && fileStream instanceof FileStream )
		{
			return fileStream;
		}

		return null;
	}

	/**
	 * @brief	States whether the file extension given can be previewed
	 *
	 * @param	EventRequest event
	 * @param	String absItemName
	 *
	 * @return	Boolean
	 */
	static supportedExtensions( event, absItemName )
	{
		return PathHelper.getFileStreamerForFile( event, absItemName ) !== null;
	};

	/**
	 * @brief	Gets all the item for the given directory
	 *
	 * @param	EventRequest event
	 * @param	String dir
	 * @param	Number position
	 * @param	Function callback
	 *
	 * @return	void
	 */
	static async getItems( event, dir, position )
	{
		return new Promise( async ( resolve, reject )=>{
			const contents	= await fs.promises.opendir( dir, { bufferSize: PAGE_SIZE } ).catch( event.next );
			let items		= {
				directories	: [],
				files		: []
			};
			let hasMore		= false;
			let counter		= 0;

			for await ( const dirent of contents )
			{
				let name	= path.join( dir, dirent.name );
				let stats	= null;
				try
				{
					stats	= fs.statSync( name );
				}
				catch ( e )
				{
					continue;
				}

				if ( counter < position )
				{
					++counter;

					continue;
				}

				if ( position + PAGE_SIZE < counter )
				{
					hasMore	= true;
					break;
				}

				name		= path.parse( name );

				let item	= PathHelper.formatItem( name, stats, false, event );

				item.isDir	? items.directories.push( item ) : items.files.push( item );
				++counter;
			}

			items			= items.directories.concat( items.files );
			const itemsRead	= parseInt( items.length );

			if ( position === 0 )
			{
				// Add the go back folder
				const backPath	= path.parse( dir );
				let stats		= null;
				try
				{
					stats	= fs.statSync( dir );
				}
				catch ( e )
				{
					reject( e );
					return;
				}

				items	= [].concat( [PathHelper.formatItem( backPath, stats, true, event )], items )
			}

			position	+= itemsRead;

			resolve( { items, position, hasMore } );
		})
	};

	/**
	 * @brief	Formats the item
	 *
	 * @param	String name
	 * @param	Object stats
	 * @param	Boolean goBack
	 * @param	EventRequest event
	 *
	 * @return	Object
	 */
	static formatItem( name, stats, goBack, event )
	{
		const itemName			= goBack ? name.dir : name.base;
		const uriToEncode		= ( goBack ? name.dir : path.join( name.dir, name.base ) ).replace( '\\', '/' );
		const encodedURI		= encodeURIComponent( uriToEncode );
		const fileStreamer		= PathHelper.getFileStreamerForFile( event, itemName );
		const previewAvailable	= fileStreamer !== null;
		const size				= stats.size;
		const isDir				= stats.isDirectory();
		const fileType			= previewAvailable ? fileStreamer.getType() : isDir ? DIRECTORY_ITEMS_TYPE : null;

		return {
			name	: goBack ? BACK_ITEM_TEXT : itemName,
			fileType,
			isDir,
			encodedURI,
			size,
			previewAvailable
		};
	};

	/**
	 * @brief	Gets the root dir
	 *
	 * @returns	String
	 */
	static getRootDir()
	{
		return getRootDir();
	}
}

module.exports	= PathHelper;
