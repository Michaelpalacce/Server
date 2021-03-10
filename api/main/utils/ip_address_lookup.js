'use strict';

// Dependencies
const os			= require( 'os' );
const http			= require( 'http' );

const IpLookup		= {};
const BOT_ADDRESS	= 'http://ipv4bot.whatismyipaddress.com';

let localIpv4s		= null;
let publicIpv4		= null;

/**
 * @brief	Returns the external IPv4 of the server
 *
 * @return	Promise
 */
IpLookup.getExternalIpv4	= function()
{
	return new Promise( async ( resolve, reject ) => {
		if ( publicIpv4 !== null )
		{
			return resolve( publicIpv4 );
		}

		http.get( BOT_ADDRESS, function( res )
		{
			res.setEncoding( 'utf8' );
			res.on( 'data', async function( chunk )
			{
				publicIpv4	= `${chunk}:${require( './get_port' ) }`;

				resolve( publicIpv4 );
			});

			res.on( 'error', () => {
				reject( 'Could not get external ipv4' );
			});
		});
	});
};

/**
 * @brief	Loops through all the local interfaces that are IpV4s and returns them
 *
 * @return	Object
 */
IpLookup.getLocalIpV4s = function()
{
	if ( localIpv4s !== null )
		return localIpv4s;

	const allInterfaces	= os.networkInterfaces();
	const interfaces	= {};

	for ( const interfaceName in allInterfaces )
	{
		allInterfaces[interfaceName].forEach( ( iface ) =>
		{
			if ( 'IPv4' !== iface.family || iface.internal !== false )
				return;

			if ( typeof interfaces[interfaceName] === 'undefined' )
				interfaces[interfaceName]	= [];

			interfaces[interfaceName].push( `${iface.address}:${require( './get_port' ) }` );
		});
	}

	localIpv4s	= interfaces;

	return localIpv4s;
};

module.exports	= IpLookup;
