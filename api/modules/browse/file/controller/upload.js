'use strict';

// Dependencies
const app			= require( 'event_request' )();
const UploadInput	= require( '../input/upload_input' );
const UploadModel	= require( '../model/upload' );
const router		= app.Router();

/**
 * @brief	Adds a '/api/file' route with method POST
 *
 * @details	Saves the file async
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/file', ( event ) => {
	const input	= new UploadInput( event );
	const model	= new UploadModel( event );

	model.upload( input ).then(() => {
		if ( event.getRequestHeader( 'x-requested-with' ) === 'XMLHttpRequest' )
			event.send( '', 201 );
		else
			event.send( '<script>window.history.back();</script>')
	}).catch( event.next );
});

module.exports	= router;
