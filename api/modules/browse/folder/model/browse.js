'use strict';

// Dependencies
const path			= require( 'path' );
const Acl			= require( '../../../../main/acls/acl' );
const User			= require( '../../../../main/security/user/user' );
const FileSystem	= require( 'fs-browser' );
const fileSystem	= new FileSystem();


const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Handles navigation within the Browse Model
 */
class BrowseModel
{
	constructor( event )
	{
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
	browse( browseInput )
	{
		const directory	= browseInput.getDirectory();

		if ( ! this._canAccess( browseInput ) )
			throw { code: 'app.browse.unauthorized', message: { directory } };

		return fileSystem.getAllItems( directory, browseInput.getToken() );
	}

	/**
	 * @brief	Checks if the user can access the given directory
	 *
	 * @param	{BrowseInput} browseInput
	 *
	 * @return	{Boolean}
	 */
	_canAccess( browseInput )
	{
		const isRoot			= Acl.is( this.user, User.ROLES.root );
		const browseMetadata	= this.user.getMetadata( 'BrowseMetadata' );

		if ( ! browseMetadata.hasRoute() )
			browseMetadata.setDefaultRoute();

		const route			= browseMetadata.getRoute();
		const requestedDir	= browseInput.getDirectory();
		const resolvedDir	= path.resolve( requestedDir );

		if ( ! isRoot && resolvedDir.includes( PROJECT_ROOT ) )
		{
			this.reason	= `You don\'t have permissions to access: ${resolvedDir}`;
			return false;
		}

		if ( ! requestedDir.includes( route ) )
		{
			this.reason	= `You don\'t have permissions to access: ${resolvedDir}`;
			return false;
		}

		return true;
	}
}

module.exports	= BrowseModel;