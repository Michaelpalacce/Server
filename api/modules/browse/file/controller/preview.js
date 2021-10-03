'use strict';

// Dependencies
const app		= require( 'event_request' )();
const FileInput	= require( '../input/file_input' );
const FileModel	= require( '../model/file' );
const router	= app.Router();

/**
 * @brief	Adds a '/api/browse/file/data' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/browse/file/data', ( event ) => {
	const input	= new FileInput( event );
	const model	= new FileModel( event );

	model.streamFile( input );
});

module.exports	= router;