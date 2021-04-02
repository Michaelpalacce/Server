'use strict';

// Dependencies
const app			= require( 'event_request' )();
const BrowseInput	= require( '../input/browse_input' );
const FileSystem	= require( 'fs-browser' );
const formatItem	= require( '../../../../main/utils/file_formatter' );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir, position
 *
 * @return	void
 */
app.get( '/browse/getFiles', async ( event ) => {
	const input			= new BrowseInput( event );
	const dir			= input.getDirectory();
	const fileSystem	= new FileSystem();

	const result		= await fileSystem.getAllItems( dir, input.getToken() ).catch( event.next );

	const response		= {
		items		: result.items.map( item => formatItem( item, event ) ),
		nextToken	: encodeURIComponent( Buffer.from( result.nextToken ).toString( 'base64' ) ),
		hasMore		: result.hasMore,
		dir
	};

	if ( input.getToken() === '' )
		response.items	= [formatItem( dir, event, true ), ...response.items];

	event.send( response );
});
