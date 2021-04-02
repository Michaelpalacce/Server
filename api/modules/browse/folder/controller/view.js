'use strict';

// Dependencies
const app			= require( 'event_request' )();
const BrowseInput	= require( '../input/browse_input' );
const BrowseModel	= require( '../model/browse' )
const { encode }	= require( '../../../../main/utils/base_64_encoder' );
const formatItem	= require( '../../../../main/utils/file_formatter' );

/**
 * @brief	Adds a '/' and '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
app.get( '/browse', async ( event ) => {
	const input				= new BrowseInput( event );
	const model				= new BrowseModel( event );
	const browseResult		= await model.browse( input );

	const items				= browseResult.items;
	const hasMore			= browseResult.hasMore;
	const nextToken			= encode( browseResult.nextToken );
	const currentDirectory	= input.getEncodedDirectory();

	event.send(
		{
			items	: items.map( item => formatItem( item, event ) ),
			nextToken,
			currentDirectory,
			hasMore
		}
	).catch( event.next );
});
