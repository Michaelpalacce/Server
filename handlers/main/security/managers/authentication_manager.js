'use strict';

const data			= require( './../../../main/data_store/filesystem_data_store' );
const conf			= require( './../../../../lib/config/env' );
const stringHelper	= require( './../../../main/utils/string_helper' );

let authenticationManger	= {};

authenticationManger.handle	= ( event, next, terminate ) =>{
	let sidCookie	= typeof event.cookies.sid === 'string' ? event.cookies.sid : false;

	if ( sidCookie )
	{
		data.read( 'tokens', sidCookie, ( err, sidData ) => {
			if ( ! err && data )
			{
				sidData.expires	= Date.now() + 3600 * 1000;
				data.update( 'tokens', sidCookie, sidData, ( err ) => {
					if ( err )
					{
						event.setError( err );
					}

					next();
				});
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
