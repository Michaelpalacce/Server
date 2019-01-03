'use strict';

const ejs						= require( 'ejs' );
const path						= require( 'path' );
const envConfig					= require( './../../config/env' );
const { Loggur, PluginManager }	= require( 'event_request' );
const AuthenticationManager		= require( './authentication_manager' );
const PROJECT_ROOT				= path.parse( require.main.filename ).dir;

// Authentication callback that will authenticated the request if the user has permissions
// this can be changed to anything you want but must return a boolean at the end
const authenticationCallback	= ( event )=>{
	let username	= typeof event.body.username === 'string' ? event.body.username : false;
	let password	= typeof event.body.password === 'string' ? event.body.password : false;

	return username === envConfig.username && password === envConfig.password;
};

module.exports		= ()=>{
	let staticResourcesPlugin	= PluginManager.getPlugin( 'event_request_static_resources' );
	let timeoutPlugin			= PluginManager.getPlugin( 'event_request_timeout' );
	let templatingEnginePlugin	= PluginManager.getPlugin( 'event_request_templating_engine' );
	let cacheServerPlugin		= PluginManager.getPlugin( 'cache_server' );
	let sessionPlugin			= PluginManager.getPlugin( 'event_request_session' );

	cacheServerPlugin.startServer( ()=>{
		Loggur.log( 'Caching server started' );
	});

	staticResourcesPlugin.setOptions( { paths : [envConfig.staticPath, 'favicon.ico'] } );
	timeoutPlugin.setOptions( { timeout : envConfig.requestTimeout } );
	templatingEnginePlugin.setOptions( { templateDir : path.join( PROJECT_ROOT, './templates' ), engine : ejs } );

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
};