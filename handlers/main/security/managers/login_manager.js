'use strict';

// Dependencies
const tokenManager	= require( './token_manager' );

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
	let sidCookie	= typeof event.cookies.sid === 'string' ? event.cookies.sid : false;

	if ( sidCookie )
	{
		tokenManager.isExpired( sidCookie, ( err ) =>{
			if ( err )
			{
				terminate();
			}
			else {
				event.redirect( '/browse' );
			}
		});
	}
	else {
		terminate();
	}
};

module.exports		= loginManager;