'use strict';

const data			= require( './../../../main/data_store/filesystem_data_store' );
const stringHelper	= require( './../../../main/utils/string_helper' );
const conf			= require( './../../../../lib/config/env' );

var tokenManager	= {};

/**
 * @brief	Creates a cookie and a token
 *
 * @param	RequestEvent event
 * @param	Function callback
 *
 * @return	void
 */
tokenManager.createCookie	= ( event, callback ) =>{
	let sid			= stringHelper.makeId();
	let tokenData	= {
		id		: sid,
		expires	: Date.now() + conf.tokenExpiration
	};
	event.setHeader( 'Set-Cookie', ['sid=' + sid] );
	data.create( 'tokens', sid, tokenData, ( err ) => {
		if ( ! err )
		{
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
