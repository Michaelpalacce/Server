'use strict';

const data			= require( './../../../main/data_store/filesystem_data_store' );
const conf			= require( './../../../../lib/config/env' );
const stringHelper	= require( './../../../main/utils/string_helper' );

let authenticationManger	= {};

/**
 * @brief	Handles the authentication by refreshing the authenticated token
 			if expired or if the token does not exists, then redirect to /login happens
 *
 * @param	RequestEvent event
 * @param	Function next
 * @param	Function terminate
 *
 * @return	void
 */
authenticationManger.handle	= ( event, next, terminate ) =>{
	let sidCookie	= typeof event.cookies.sid === 'string' ? event.cookies.sid : false;

	if ( sidCookie )
	{
		data.read( 'tokens', sidCookie, ( err, sidData ) => {
			if ( ! err && sidData )
			{
				if ( sidData.expires > Date.now() )
				{
					sidData.expires	= Date.now() + 3600 * 1000;
					data.update( 'tokens', sidCookie, sidData, ( err ) => {
						if ( err )
						{
							event.setError( err );
							terminate();
						}
						else {
							next();
						}
					});
				}
				else {
					data.delete( 'tokens', sidCookie, ( err ) => {
						if ( err )
						{
							event.setError( err );
							terminate();
						}
						else {
							event.redirect( '/login' );
							terminate();
						}
					});
				}
			}
			else {
				event.redirect( '/login' );
				terminate();
			}
		});
	}
	else {
		event.redirect( '/login' );
		terminate();
	}
};

// Export the module
module.exports	= authenticationManger;
