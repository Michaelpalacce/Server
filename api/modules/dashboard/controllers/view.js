'use strict';

// Dependencies
const app		= require( 'event_request' )();
const router	= app.Router();

/**
 * @brief	Adds a '/api/dashboard' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/dashboard', async ( event ) => {
	const dashboardMetadata	= event.$user.getDashboardMetadata();

	event.send( dashboardMetadata.getAll() );
});

module.exports	= router;