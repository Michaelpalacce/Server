'use strict';

// Dependencies
const app			= require( 'event_request' )();
const DownloadInput	= require( '../input/download_input' );
const DownloadModel	= require( '../model/download' );
const router		= app.Router();

/**
 * @brief	Adds a '/api/items' route with method GET
 *
 * @details	items is an array of decoded items that have been JSON stringified and then base64 encoded using the encode tool
 *
 * @details	Required Parameters: items
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/items', ( event ) => {
	const input	= new DownloadInput( event );
	const model	= new DownloadModel( event );

	model.downloadItems( input );
});

module.exports	= router;
