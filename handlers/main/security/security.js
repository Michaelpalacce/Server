'use strict';


// Dependencies
const Router				= require( './../../../lib/server/router' );
const stringHelper			= require( './../utils/string_helper' );
const dataStore				= require( './../data_store/filesystem_data_store' );
const authenticationManger	= require( './managers/authentication_manager' );
const loginManager			= require( './managers/login_manager' );

let router					= new Router();
const securityConfiguration	= [
	// Global authentication manager that denies all requests if you are not logged in fi
	{
		path	: '^(?!\/login).*$',
		methods	: [],
		manager	: authenticationManger
	},
	{
		path	: '/login',
		methods	: ['GET', 'POST'],
		manager	: loginManager
	}
];

/**
 * @brief	Middleware responsible for security and authentication
 *
 * @param	RequestEvent event
 *
 * @return	void
 */
router.add( ( event ) => {
	let config		= securityConfiguration.slice( 0 );

	let terminate	= () =>{
		event.next();
	};

	let next		= () =>
	{
		if ( config.length === 0 )
		{
			terminate();
		}
		else {
			let managerConfig	= config.shift();

			let regExp			= new RegExp( managerConfig.path );
			if (
				 regExp.exec( event.path )
				&& ( managerConfig.methods.indexOf( event.method ) !== -1 || managerConfig.methods.length === 0 )
			) {
				managerConfig.manager.handle( event, next, terminate );
			}
			else {
				next();
			}
		}
	};

	next();
});

module.exports	= router;
