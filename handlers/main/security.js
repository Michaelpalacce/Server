'use strict';

// Dependencies
const envConfig				= require( './../../config/env' );
const AuthenticationManager	= require( './authentication_manager' );
const { SessionHandler }	= require( 'event_request' );
const { TokenManager }		= SessionHandler;

// Authentication callback that will authenticated the request if the user has permissions
// this can be changed to anything you want but must return a boolean at the end
const authenticationCallback	= ( event )=>{
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	return username === envConfig.username && password === envConfig.password;
};

module.exports	= {
	attachSecurity	: ( server ) => {
		server.use( 'session', {
				tokenExpiration			: envConfig.tokenExpiration,
				authenticationRoute		: '/login',
				authenticationCallback	: authenticationCallback,
				tokenManager			: TokenManager,
				managers				: [
					'default',
					{
						instance	: AuthenticationManager,
						options		: { indexRoute : '/browse' }
					}
				]
			}
		);
	}
};
