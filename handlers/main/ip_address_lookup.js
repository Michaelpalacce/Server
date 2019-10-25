'use strict';

const os				= require( 'os' );
const http				= require( 'http' );

const IpLookup			= {};
const PUBLIC_IP_STRING	= 'PUBLIC_IP';
const BOT_ADDRESS		= 'http://ipv4bot.whatismyipaddress.com';

let localIpv4s			= null;

/**
 * @brief	Returns the external IPv4 of the server
 *
 * @return	Promise
 */
IpLookup.getExternalIpv4	= function()
{

	return new Promise(( resolve, reject )=>{
		const Cache	= process.cachingServer;

		if ( typeof Cache === 'undefined' )
		{
			resolve( 'localhost' );
		}

		const dataSet	= Cache.get( PUBLIC_IP_STRING );

		if ( dataSet != null )
		{
			resolve( dataSet.value )
		}
		else
		{
			http.get( BOT_ADDRESS, function( res )
			{
				res.setEncoding( 'utf8' );
				res.on( 'data', function( chunk )
				{
					chunk	= `${chunk}:${process.env.port}`;

					resolve( Cache.set( PUBLIC_IP_STRING, chunk, 0 ).value, -1, false );
				});

				res.on( 'error', ()=>{
					reject( 'Could not get external ipv4' );
				} );
			});
		}
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
	{
		return localIpv4s;
	}

	let allInterfaces	= os.networkInterfaces();
	let interfaces		= {};

	for ( let interfaceName in allInterfaces )
	{
		allInterfaces[interfaceName].forEach( ( iface ) =>
		{
			if ( 'IPv4' !== iface.family || iface.internal !== false )
			{
				return;
			}

			if ( typeof interfaces[interfaceName] === 'undefined' )
			{
				interfaces[interfaceName]	= [];
			}

			interfaces[interfaceName].push( `${iface.address}:${process.env.port}` );
		});
	}

	localIpv4s	= interfaces;

	return localIpv4s;
};

module.exports	= IpLookup;
