'use strict';

const app			= require( 'event_request' )();
const { encode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Adds a new route `/api/user/route`
 *
 * @details	No Optional or required params
 * 			Returns the user browse route
 *
 * @return	void
 */
app.get( '/api/browse/user/route', ( event ) => {
	event.send( { route: encode( event.$user.getBrowseMetadata().getRoute() ) } );
});