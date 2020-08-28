'use strict';

// Dependencies
const app			= require( 'event_request' )();
const IpLookup		= require( '../../main/utils/ip_address_lookup' );

/**
 * @brief	Adds a '/ip/private' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/ip/private', ( event ) => {
	event.send( IpLookup.getLocalIpV4s() );
});

/**
 * @brief	Adds a '/ip/public' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/ip/public', async ( event ) => {
	event.send( await IpLookup.getExternalIpv4().catch( event.next ) );
});

