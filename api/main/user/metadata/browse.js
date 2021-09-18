'use strict';

/**
 * @brief	Class responsible for handling the Browse Module Metadata
 */
class BrowseMetadata
{
	constructor( data )
	{
		this.route	= data['route'] || '';
	}

	/**
	 * @brief	Returns the route
	 *
	 * @details	Will return an empty string if the route is not set
	 *
	 * @return {String}
	 */
	getRoute()
	{
		if ( ! this.hasRoute() )
			throw { code: 'app.user.browseMetadata.missingRoute' };

		return this.route;
	}

	/**
	 * @brief	Checks if the BrowseMetadata has a route set
	 *
	 * @return	{Boolean}
	 */
	hasRoute()
	{
		return this.route !== '';
	}

	/**
	 * @brief	Sets the route in the metadata
	 *
	 * @param	{String} route
	 *
	 * @return	void
	 */
	setRoute( route )
	{
		this.route	= route;
	}

	/**
	 * @brief	Sets the route to the BrowseMetadata.DEFAULT_ROUTE
	 *
	 * @return	void
	 */
	setDefaultRoute()
	{
		this.setRoute( BrowseMetadata.DEFAULT_ROUTE );
	}
}

/**
 * @brief	Default route
 *
 * @var		{String}
 */
BrowseMetadata.DEFAULT_ROUTE	= process.env.USER_DATA_PATH;

module.exports	= BrowseMetadata;
