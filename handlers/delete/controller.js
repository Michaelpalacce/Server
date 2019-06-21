'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const fs			= require( 'fs' );

let router		= Server().Router();

/**
 * @brief	Adds a '/download' route with method GET
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/delete',
	method	: 'DELETE',
	handler	: ( event ) => {
		let result	= event.validationHandler.validate( event.queryString, { file : 'filled||string' } );

		let file	= ! result.hasValidationFailed()
					? event.queryString.file
					: false;

		if ( file === false || ! fs.existsSync( file ) )
		{
			event.next( 'File does not exist' );
		}
		else
		{
			fs.unlink( file, ( err ) => {
				if ( ! err )
				{
					event.send( [ 'ok' ] );
				}
				else
				{
					event.next( 'Could not delete file' );
				}
			});
		}
	}
});

module.exports	= router;
