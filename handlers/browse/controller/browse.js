'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const Model			= require( '../model/browse' );
const router		= Server().Router();

/**
 * @brief	Adds a '/' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/', Model.browseAction );

/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/browse', Model.browseAction );

/**
 * @brief	Adds a '/browse/getFiles' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: dir
 *
 * @return	void
 */
router.get( '/browse/getFiles', Model.getFilesAction );

/**
 * @brief	Adds a '/file/hasPreview' route with method GET
 *
 * @details	Required Parameters: file
 *
 * @return	void
 */
router.get( '/file/getFileData', Model.getFilesData );

module.exports	= router;
