'use strict';

/**
 * @brief	FormBodyParser resposible for parsing application/x-www-form-urlencoded forms
 */
class FormBodyParser
{
	constructor( options )
	{
		// Defaults to 1 MB
		this.maxPayloadLength	= options.maxPayloadLength || 1048576;
	}

	/**
	 * @brief	Parser the form body if possible and returns an object
	 *
	 * @param	Buffer rawPayload
	 * @param	Function callback
	 *
	 * @return	Object
	 */
	parseFormBody( rawPayload, callback )
	{
		try
		{
			if ( rawPayload.length > this.maxPayloadLength )
			{
				callback( 'Max payload length reached', {} );
			}

			let decodedPayload	= decodeURIComponent( rawPayload.toString( 'ascii' ) );
			decodedPayload		= decodedPayload.split( '&' );
			let body			= {};

			for ( let i = 0; i < decodedPayload.length; ++ i )
			{
				let param	= decodedPayload[i].split( '=' );

				if ( param.length !== 2 )
				{
					continue;
				}

				let key		= param[0];
				let value	= param[1];

				body[key]	= value;
			}

			callback( false, body );
		}
		catch ( err )
		{
			callback( 'Error parsing the body' );
		}
	}
}


module.exports	= FormBodyParser;
