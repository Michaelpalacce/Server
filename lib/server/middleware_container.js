'use strict';

// Define the object
let middlewaresContainer	= {};

/**
 * @brief	Middleware responsible for decoding form data passed
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
middlewaresContainer.formParser	= ( event ) =>
{
	let decodedPayload	= decodeURIComponent( event.payload );
	decodedPayload		= decodedPayload.split( '&' );
	event.body			= {};

	for ( let i = 0; i < decodedPayload.length; ++ i )
	{
		let param	= decodedPayload[i].split( '=' );

		if ( param.length !== 2 )
		{
			continue;
		}

		let key		= param[0];
		let value	= param[1];

		event.body[key]	= value;
	}

	event.next();
};

/**
 * @brief	Parses the given cookies and sets them to event.cookies
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
middlewaresContainer.parseCookies	= ( event ) =>{
	var list = {},
        rc = event.headers.cookie;

    rc && rc.split( ';' ).forEach( function( cookie ) {
        var parts					= cookie.split( '=' );
        list[parts.shift().trim()]	= decodeURI( parts.join( '=' ) );
    });

    event.cookies	= list;
	event.next();
};

// Export the module
module.exports	= middlewaresContainer;
