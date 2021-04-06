'use strict';

//@TODO	THIS CLASS NEEDS TO BE SIMPLIFIED WITH A MODEL

// Dependencies
const app			= require( 'event_request' )();
const path			= require( 'path' );
const fs			= require( 'fs' );
const archiver		= require( 'archiver' );
const ItemsInput	= require( '../input/items_input' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Callback called when downloading a file fails
 *
 * @param	{EventRequest} event
 * @param	{String} text
 *
 * @return	void
 */
const downloadFailedCallback	= ( event, text = 'The file specified does not exist' ) => {
	event.setResponseHeader( 'Content-disposition', 'attachment; filename="error.log"' );
	event.setResponseHeader( 'Content-type', '.log' );

	event.send( text );
};

/**
 * @brief	Checks if the user has permission to access the given directory
 *
 * @param	{EventRequest} event
 * @param	{String} itemName
 */
const hasPermission	= ( event, itemName ) => {
	try
	{
		fs.statSync( itemName );
	}
	catch ( e )
	{
		throw { code: 'app.browse.download.itemDoesNotExist' }
	}

	const route			= event.$user.getBrowseMetadata().getRoute();
	const resolvedItem	= path.resolve( itemName );
	const resolvedRoute	= path.resolve( route );

	if ( ! resolvedItem.includes( resolvedRoute ) || resolvedItem.includes( PROJECT_ROOT ) )
		throw { code: 'app.browse.download.unauthorized', message : `No permissions to access ${resolvedItem}`, status: 403 };
}

/**
 * @brief	Adds a '/items' route with method GET
 *
 * @details	items is an array of decoded items that have been JSON stringified and then base64 encoded using the encode tool
 *
 * @details	Required Parameters: items
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/items', ( event ) => {
	const input	= new ItemsInput( event );
	const items	= input.getItems();

	event.clearTimeout();

	const archive		= archiver( 'zip', { zlib: { level: 9 } } );
	const firstItem		= items[0];
	const parsedItem	= path.parse( firstItem );

	if ( items.length === 1 )
	{
		const stats		= fs.statSync( firstItem );
		const fileName	= parsedItem.base.replace( '/', '' );

		hasPermission( event, firstItem );

		if ( stats.isDirectory() )
		{
			archive.pipe( event.response );
			event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}.zip"` );
			event.setResponseHeader( 'Content-type', 'zip' );

			try
			{
				archive.directory( firstItem, false );
				archive.finalize();
			}
			catch ( e )
			{
				downloadFailedCallback( event );
			}
		}
		else
		{
			event.setResponseHeader( 'content-disposition', `attachment; filename="${fileName}"` );
			event.setResponseHeader( 'Content-type', parsedItem.ext );
			event.setResponseHeader( 'Content-Length', stats.size );

			try
			{
				fs.createReadStream( firstItem ).pipe( event.response );
			}
			catch ( e )
			{
				downloadFailedCallback( event );
			}
		}

		return;
	}

	let piped	= false;

	event.setResponseHeader( 'content-disposition', `attachment; filename="${parsedItem.dir === '/' ? 'ROOT' : path.parse( parsedItem.dir ).base}.zip"` );
	event.setResponseHeader( 'Content-type', 'zip' );

	for ( const item of items )
	{
		hasPermission( event, firstItem );

		if ( ! piped )
		{
			piped	= true;
			archive.pipe( event.response );
		}

		const parsedItem	= path.parse( item );
		const stats			= fs.statSync( item );

		try
		{
			stats.isDirectory() ? archive.directory( item, false ) : archive.file( item, { name: parsedItem.base } );
		}
		catch ( e )
		{
			downloadFailedCallback( event );
		}
	}

	archive.finalize();
});
