'use strict';

/**
 * @brief	Class responsible for handling the Dashboard Module Metadata
 */
class DashboardMetadata
{
	constructor( data )
	{
		this.browseFavorites	= data['browseFavorites'] || [
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
		];
	}

	/**
	 * @brief	Returns an array of all the browse favorite links
	 *
	 * @details	The Array has the following structure:
	 * 			[
	 * 				{ name: String, isDir: Boolean, linkToFileLocation: String, previewAvailable: Boolean, linkToPreview: String }
	 * 			]
	 *
	 * @returns	{Array}
	 */
	getBrowseFavorites()
	{
		return this.browseFavorites;
	}

	/**
	 * @brief	Adds a new browse favorite
	 *
	 * @param	{Object} item - The browse item to add
	 *
	 * @return	void
	 */
	addBrowseFavorite( item )
	{
		const itemId	= this._getIdFromBrowseFavorite( item );

		if ( this._findBrowseFavoriteIndexById( itemId ) !== -1 )
			throw { code: 'app.user.dashboard.browseFavoriteExists' };

		item.id	= itemId;
		this.browseFavorites.push( item );
	}

	/**
	 * @brief	Removes a browse favorite by it's id ( md5( encodedURI + size ) )
	 *
	 * @return	void
	 */
	removeBrowseFavorite( id )
	{
		const indexToSplice	= this._findBrowseFavoriteIndexById( id );

		if ( indexToSplice === -1 )
			throw { code: 'app.user.dashboard.browseFavoriteDoesNotExist' };

		this.browseFavorites.splice( indexToSplice, 1 );
	}

	/**
	 * @brief	Returns all the dashboard data needed
	 *
	 * @returns	{Object}
	 */
	getAll()
	{
		return {
			browseFavorites: this.browseFavorites
		}
	}

	/**
	 * @brief	Creates an id from a browse favorite using encodedURI and size
	 *
	 * @param	{Object} item
	 *
	 * @return	String
	 */
	_getIdFromBrowseFavorite( item )
	{
		return crypto.createHash( 'md5' ).update( `${item.encodedURI}${item.size}` ).digest( 'hex' );
	}

	/**
	 * @brief	Finds browse favorite index or returns -1 if not found
	 *
	 * @returns	{Number}
	 */
	_findBrowseFavoriteIndexById( id )
	{
		return this.browseFavorites.reduce( ( accumulator, item, index ) => {
			if ( this._getIdFromBrowseFavorite( item ) === id )
				accumulator	= index;
			return accumulator;
		}, -1 );
	}
}


module.exports	= DashboardMetadata;
