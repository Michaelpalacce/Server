'use strict';

// Dependencies
const path				= require( 'path' );
const FileSystem		= require( 'fs-browser' );

const formatItem		= require( '../../../../main/utils/file_formatter' );
const { encode }		= require( '../../../../main/utils/base_64_encoder' );

const fileSystem		= new FileSystem();
const forbiddenDirs		= require( '../../utils/forbidden_folders' );
const { itemInFolder }	= require( '../../utils/folders' );

/**
 * @brief	Handles navigation within the Browse Model
 */
class BrowseModel
{
	constructor( event )
	{
		this.event				= event;
		this.user				= event.$user;
		this.validationHandler	= event.validation;
		this.query				= event.query;
	}

	/**
	 * @brief	Returns an Object with information about the items
	 *
	 * @details	The items returned will be sorted alphanumerically and will always be folders first and then files
	 * 			The browsing is paginated
	 * 			A token will be returned that must be provided back for the pagination to work
	 *
	 * @param	{BrowseInput} browseInput
	 *
	 * @return	Object
	 */
	async browse( browseInput )
	{
		if ( ! browseInput.isValid() )
			throw { code: 'app.input.invalidBrowseInput', message : browseInput.getReasonToString() };

		const directory		= browseInput.getDirectory();
		const route			= this.user.getBrowseMetadata().getRoute();

		for ( const forbiddenDir of forbiddenDirs )
			if ( itemInFolder( directory, forbiddenDir, true ) || ! itemInFolder( directory, route ) )
				throw { code: 'app.browse.browse.unauthorized', message: `You don\'t have permissions to access: ${directory}`, status: 403 };

		const parsedItem	= path.parse( directory );
		const itemsResult	= await fileSystem.getAllItems( directory, browseInput.getToken() );

		return {
			currentDirectory:	browseInput.getEncodedDirectory(),
			previousDirectory:	encode( parsedItem.dir.replace( /\\/g, '/' ) ),
			nextToken:			encode( itemsResult.nextToken ),
			items:				itemsResult.items.map( item => formatItem( item, this.event ) ),
			hasMore:			itemsResult.hasMore,
		};
	}
}

module.exports	= BrowseModel;
