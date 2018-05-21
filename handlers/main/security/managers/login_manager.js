'use strict';

const data			= require( './../../../main/data_store/filesystem_data_store' );
const conf			= require( './../../../../lib/config/env' );
const stringHelper	= require( './../../../main/utils/string_helper' );

let loginManager	= {};

/**
 * @brief	Sets an authenticated token if the provided username and password are correct
 *
 * @param	RequestEvent event
 * @param	Function next
 * @param	Function terminate
 *
 * @return	void
 */
loginManager.handle	= ( event, next, terminate ) => {

	// if  ( event.method === 'GET' )
	// {
	// 	if ( typeof event.cookies.sid === 'string' )
	// 	{
	// 		data.read( 'tokens', event.cookies.sid, ( err, sidData ) =>{
	// 			if ( ! err && sidData )
	// 			{
	// 				if ( typeof sidData.expires === 'number' && sidData.expires > Date.now() )
	// 				{
	// 					event.redirect( '/' );
	// 					terminate();
	// 				}
	// 				else {
	// 					data.delete( 'tokens', event.cookies.sid, ( err ) =>{
	// 						event.setHeader( 'Set-Cookie', ['sid='] );
	// 						event.next()
	// 					});
	// 				}
	// 			}
	// 			else {
	// 				data.delete( 'tokens', event.cookies.sid, ( err ) =>{
	// 					event.setHeader( 'Set-Cookie', ['sid='] );
	// 					event.next();
	// 				});
	// 			}
	// 		});
	// 		terminate();
	// 	}
	// 	else {
	// 		terminate();
	// 	}
	// }

	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	if ( username === conf.username && password === conf.password )
	{
		let sid			= stringHelper.makeId();
		let tokenData	= {
			id		: sid,
			expires	: Date.now() + 3600 * 1000
		};
		event.setHeader( 'Set-Cookie', ['sid=' + sid] );
		data.create( 'tokens', sid, tokenData, ( err ) => {
			if ( ! err )
			{
				next();
			}
			else {
				event.setError( err );
				terminate();
			}
		});
	}
	else {
		event.redirect( '/login' );
		terminate();
	}
};

module.exports		= loginManager;
