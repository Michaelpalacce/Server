'use strict';

const data			= require( './../../../main/data_store/filesystem_data_store' );
const conf			= require( './../../../../lib/config/env' );
const stringHelper	= require( './../../../main/utils/string_helper' );

let loginManager	= {};

loginManager.handle	= ( event, next, terminate ) => {
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
				next();
			}
		});
	}
	else {
		next();
	}
};

module.exports		= loginManager;
