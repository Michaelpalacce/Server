'use strict';

// Dependencies
const tokenManager	= require( './token_manager' );
const conf			= require( './../../../../lib/config/env' );

// Container
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
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	if ( username === conf.username && password === conf.password )
	{
		tokenManager.createCookie( event, ( err ) =>{
			if ( err )
			{
				event.setError( 'Could not create token or cookie' );
				terminate();
			}
			else {
				next();
			}
		});
	}
	else {
		event.setError( 'Invalid username or password' );
	}
};

module.exports		= loginManager;
