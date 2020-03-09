'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const IpLookup		= require( '../../main/ip_address_lookup' );

const router		= Server().Router();

/**
 * @brief	Adds a '/ip' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.get( '/ip', async( event ) => {
		const ipInterfaces	= IpLookup.getLocalIpV4s();
		const externalIP	= await IpLookup.getExternalIpv4().catch( event.next );

		event.render( 'ip', { ipInterfaces, externalIP } );
	}
);

module.exports	= router;
