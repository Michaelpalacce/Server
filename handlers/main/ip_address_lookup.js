'use strict';

const os						= require( 'os' );
const http						= require( 'http' );
const { Loggur, LOG_LEVELS }	= require( 'event_request' );

const IpLookup			= {};
const PUBLIC_IP_STRING	= 'PUBLIC_IP';

let localIpv4s			= null;

/**
 * @brief	Returns the external IPv4 of the server
 *
 * @return	Promise
 */
IpLookup.getExternalIpv4	= function()
{
	const Cache	= process.cachingServer.model( 'Cache' );

	return new Promise(( resolve, reject )=>{
		Cache.find( PUBLIC_IP_STRING ).then(( PublicIpRecord )=>{
			if ( PublicIpRecord != null && typeof PublicIpRecord.recordData !== 'undefined' )
			{
				resolve( PublicIpRecord.recordData )
			}
			else
			{
				http.get( 'http://ipv4bot.whatismyipaddress.com', function( res )
				{
					res.setEncoding( 'utf8' );
					res.on( 'data', function( chunk )
					{
						Cache.make( PUBLIC_IP_STRING, chunk, { ttl: 0 } ).catch(()=>{
							Loggur.log( 'Could not save Public IP', LOG_LEVELS.info );
						});

						resolve( chunk );
					});

					res.on( 'error', ()=>{
						reject( 'Could not get external ipv4' );
					} );
				});
			}
		}).catch( reject );
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

			interfaces[interfaceName].push( iface.address );
		});
	}

	localIpv4s	= interfaces;

	return localIpv4s;
};

module.exports	= IpLookup;
