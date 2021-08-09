'use strict';

/**
 * @brief	Class responsible for handling the Dashboard Module Metadata
 */
class DashboardMetadata
{
	constructor( data )
	{
		this.browseFavorites	= data['browseFavorites'] || [
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', linkToFileLocation: '/browse?directory=L1Rlc3Q%253D', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', linkToFileLocation: '/browse?directory=L1Rlc3Q%253D', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', linkToFileLocation: '/browse?directory=L1Rlc3Q%253D', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', linkToFileLocation: '/browse?directory=L1Rlc3Q%253D', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
			{ name: 'Adobe Scan Jul 19, 2021_1.jpg', isDir: false, fileType: 'image', linkToFileLocation: '/browse?directory=L1Rlc3Q%253D', previewAvailable: true, encodedURI: 'L1Rlc3QvQWRvYmUgU2NhbiBKdWwgMTksIDIwMjFfMS5qcGc%3D', size: 200 },
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
}


module.exports	= DashboardMetadata;
