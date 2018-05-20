'use strict';

// Dependencies
const Router		= require( './../../lib/server/router' );
const data			= require( './../main/data_store/filesystem_data_store' );
const conf			= require( './../../lib/config/env' );
const stringHelper	= require( './../main/utils/string_helper' );

let router		= new Router();

/**
 * @brief	Adds a '/login' route with method GET
 *
 * @details	Required Parameters: NONE
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/login', 'GET', ( event ) => {
	event.render( 'login', {}, ( err ) => {
		if ( err )
		{
			event.setError( err );
			event.next();
		}
	});
});
/**
 * @brief	Adds a '/browse' route with method GET
 *
 * @details	Required Parameters: dir
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add( '/login', 'POST', ( event ) => {
	let credentials	= event.body;

	if ( credentials.username === conf.username && credentials.password === conf.password )
	{
		let sid			= stringHelper.makeId();
		let tokenData	= {
			id		: sid,
			auth	: true,
			expires	: Date.now() + 3600 * 1000
		};

		event.response.setHeader( 'Set-Cookie', 'sid=' + sid );
		data.create( 'tokens', sid, tokenData, ( err ) => {
			if ( err )
			{
				event.setError( 'Error while creating credential token' );
			}
			else
			{
				event.redirect( '/' );
			}

			event.next();
		});
	}
	else {
		event.setError( 'Invalid login credentials' );
		event.next();
	}
});

module.exports	= router;
