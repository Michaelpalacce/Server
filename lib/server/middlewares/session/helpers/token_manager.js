'use strict';

const data			= require( './filesystem_data_store' );
const stringHelper	= require( './string_helper' );
const conf			= require( '../../../../config/env' );

var tokenManager	= {};

/**
 * @brief	Creates a cookie and a token
 *
 * @param	RequestEvent event
 * @param	String name
 * @param	Function callback
 *
 * @return	void
 */
tokenManager.createCookie	= ( event, name, callback ) =>{
	let sid			= stringHelper.makeId();
	let tokenData	= {
		id		: sid,
		expires	: Date.now() + conf.tokenExpiration
	};

	data.create( 'tokens', sid, tokenData, ( err ) => {
		if ( ! err )
		{
			event.setHeader( 'Set-Cookie', [ name + '=' + sid] );
			callback( false );
		}
		else {
			callback( err );
		}
	});
};

/**
 * @brief	Check if token is expired
 *
 * @param	String sid
 * @param	Function callback
 *
 * @return	void
 */
tokenManager.isExpired		= ( sid, callback ) =>{
	data.read( 'tokens', sid, ( err, sidData ) => {
		if ( ! err && sidData )
		{
			if ( sidData.expires > Date.now() )
			{
				callback( false )
			}
			else {
				callback( true );
			}
		}
		else {
			callback( true );
		}
	});
};

/**
 * @brief	Updates the token expiration tim
 *
 * @param	String sid
 * @param	Function callback
 *
 * @return	void
 */
tokenManager.updateToken	= ( sid, callback ) =>{
	data.read( 'tokens', sid, ( err, sidData ) => {
		if ( ! err && sidData )
		{
			sidData.expires	= Date.now() + conf.tokenExpiration;
			data.update( 'tokens', sid, sidData, ( err ) => {
				if ( err )
				{
					callback( err );
				}
				else {
					callback( false );
				}
			});
		}
		else {
			callback( true );
		}
	});
};

module.exports		= tokenManager;
