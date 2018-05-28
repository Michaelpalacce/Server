'use strict';

/**
 * @brief	FormBodyParser responsible for parsing application/x-www-form-urlencoded forms
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
		if ( rawPayload.length > this.maxPayloadLength )
		{
			callback( 'Max payload length reached', {} );
		}

		let decodedPayload	= decodeURIComponent( rawPayload.toString( 'ascii' ) );
		let body			= {};

		try
		{
			body	= JSON.parse( decodedPayload );
			callback( false, body );
		}
		catch ( e )
		{
			body				= {};
			let payloadParts	= decodedPayload.split( '&' );

			for ( let i = 0; i < payloadParts.length; ++ i )
			{
				let param	= payloadParts[i].split( '=' );

				if ( param.length !== 2 )
				{
					continue;
				}

				body[param[0]]	= param[1];
			}

			callback( false, body );
		}
	}
}

module.exports	= FormBodyParser;
