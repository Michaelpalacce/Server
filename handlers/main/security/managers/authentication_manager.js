'use strict';

// Dependencies
const tokenManager			= require( './token_manager' );

// Continer
let authenticationManger	= {};

// Constants
const LOGIN_ROUTE			= '/login';

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
		tokenManager.isExpired( sidCookie, ( err ) =>{
			if ( err )
			{
				event.redirect( LOGIN_ROUTE );
			}
			else {
				tokenManager.updateToken( sidCookie, ( err ) =>{
					if ( err )
					{
						event.serverError( 'Could not update token.' );
					}
					else
					{
						terminate();
					}
				});
			}
		});
	}
	else
	{
		event.redirect( LOGIN_ROUTE );
	}
};

// Export the module
module.exports	= authenticationManger;
