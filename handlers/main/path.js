'use strict';

// Dependencies
const path	= require( 'path' );
const fs	= require( 'fs' );

// Responsible for returning all the items of a dir in a correct format
let pathHelper	= {};
/**
 * @brief	Gets all the item for the given directory
 *
 * @param	String dir
 * @param	Function callback
 *
 * @return	void
 */
pathHelper.getItems	= ( dir, callback ) => {
	fs.readdir( dir, {}, ( error, data ) => {
		if ( ! error && data )
		{
			let items	= {
				directories	: [],
				files		: []
			};

			// Add the go back folder
			let backPath	= path.parse( dir );
			let stats		= null;
			try
			{
				stats	= fs.statSync( dir );
			}
			catch ( e )
			{
				callback( true );
				return;
			}

			items.directories.push( pathHelper.formatItem( backPath, stats, true ) );

			for ( let i = 0; i < data.length; ++ i )
			{
				// Add the current dir items
				let name	= path.join( dir, data[i] );
				let stats	= null;
				try
				{
					stats	= fs.statSync( name );
				}
				catch ( e )
				{
					continue;
				}
				name		= path.parse( name );

				let item	= pathHelper.formatItem( name, stats, false );

				item.isDir	? items.directories.push( item ) : items.files.push( item );
			}

			items	= items.directories.concat( items.files );

			callback( false, items );
		}
		else
		{
			callback( true );
		}
	});
};
/**
 * @brief	Formats the item
 *
 * @param	String name
 *
 * @return	Object
 */
pathHelper.formatItem	= ( name, stats, goBack ) => {
	let itemName	= goBack ? name.dir : name.base;
	let uri			= encodeURIComponent( goBack ? name.dir : path.join( name.dir, name.base ) );

	return {
		name		: itemName,
		encodedURI	: uri,
		size		: stats.size,
		isDir		: stats.isDirectory()
	}
};

module.exports	= pathHelper;