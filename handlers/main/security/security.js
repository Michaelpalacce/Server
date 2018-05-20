'use strict';


// Dependencies
const Router		= require( './../../../lib/server/router' );
const stringHelper	= require( './../utils/string_helper' );
const dataStore		= require( './../data_store/filesystem_data_store' );

let router		= new Router();

router.add( ( event ) => {
		if ( typeof event.cookies.sid === 'string' )
		{
			dataStore.read( 'tokens', event.cookies.sid, ( err, data ) => {
				if ( ! err && data )
				{
					if ( data.expires > Date.now() && data.auth === true )
					{
						data.expires	= Date.now() + 3600 * 1000;
						dataStore.update( 'tokens', event.cookies.sid, data, ( err ) =>{
							event.next();
						});
					}
					else {
						event.redirect( '/login' );
						event.next();
					}
				}
				else {
					event.redirect( '/login' );
					event.next();
				}
			});
		}
		else {
			let sid				= stringHelper.makeId();
			let createCookie	=  {
										id: sid,
										auth: false,
										expires: Date.now() +  3600 * 1000
									};
			event.response.setHeader( 'Set-Cookie', 'sid=' + sid );
			dataStore.create( 'tokens', sid, createCookie, ( err ) =>{
				if ( err )
				{
					event.setError( err );
				}
				event.redirect( '/login' );
				event.next();
			});
		}
});

module.exports	= router;
