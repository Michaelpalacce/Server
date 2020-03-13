'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const IpLookup		= require( '../../main/ip_address_lookup' );

const app			= Server();

/**
 * @brief	Adds a '/ip' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.get( '/ip/private', async( event ) => {
		const ipInterfaces	= IpLookup.getLocalIpV4s();
		const externalIP	= await IpLookup.getExternalIpv4().catch( event.next );

		event.send( ipInterfaces );
	}
);

app.get( '/ip/public', async( event ) => {
		const ip	= await IpLookup.getExternalIpv4().catch( event.next );

		event.send( ip );
	}
);

