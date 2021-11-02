'use strict';

// Dependencies
const app			= require( 'event_request' )();
const axios			= require("axios");
const router		= app.Router();
const { version }	= require( '../../../../package.json' );

/**
 * @brief	Adds a '/api/latest/version' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/latest/version', async ( event ) => {
	const response	= await axios.get( 'https://registry.npmjs.org/server-emulator' ).catch( ( error ) => {
		return error.response;
	});

	if ( response.status !== 200 ) {
		await event.sendError({
			code: 'app.admin.latestVersion.communicationError',
			message: "Error while fetching latest version"
		});
		return;
	}

	event.send( response.data["dist-tags"].latest );
});

/**
 * @brief	Adds a '/api/latest/current' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/latest/current', async ( event ) => {
	event.send( version );
});

module.exports	= router;