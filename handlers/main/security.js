'use strict';

// Dependencies
const envConfig				= require( './../../config/env' );
const AuthenticationManager	= require( './authentication_manager' );
const { PluginManager }		= require( 'event_request' );

// Authentication callback that will authenticated the request if the user has permissions
// this can be changed to anything you want but must return a boolean at the end
const authenticationCallback	= ( event )=>{
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	return username === envConfig.username && password === envConfig.password;
};

let sessionPlugin	= PluginManager.getPlugin( 'event_request_session' );

sessionPlugin.setOptions({
	tokenExpiration			: envConfig.tokenExpiration,
	authenticationRoute		: '/login',
	authenticationCallback	: authenticationCallback,
	managers				: [
		'default',
		{
			instance	: AuthenticationManager,
			options		: { indexRoute : '/browse' }
		}
	]
});

module.exports	= sessionPlugin;
