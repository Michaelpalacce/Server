'use strict';

// Dependencies
const { SessionHandler, Router }	= require( 'event_request' );
const { SecurityManager }			= SessionHandler;

// Constants
const MANAGER_METHODS	= [];

/**
 * @brief	Handles the authentication by refreshing the authenticated token
 */
class AuthenticationManager extends SecurityManager
{
	/**
	 * @see	SecurityManager::constructor()
	 */
	constructor( options )
	{
		super( options );
		this.indexRoute				= this.options.indexRoute;
		this.authenticationRoute	= this.options.authenticationRoute;

		this.sanitize();
	}

	/**
	 * @see	SecurityManager::sanitize()
	 */
	sanitize()
	{
		if ( this.authenticationRoute == undefined || this.indexRoute == undefined )
		{
			throw new Error( 'Invalid Configuration provided' );
		}
	}

	/**
	 * @see	SecurityManager::getPath()
	 */
	getPath()
	{
		return new RegExp( '' );
	}

	/**
	 * @see	SecurityManager::getMethods()
	 */
	getMethods()
	{
		return MANAGER_METHODS;
	}

	/**
	 * @see	SecurityManager::handle()
	 */
	handle( event, next, terminate )
	{
		let session	= event.session;
		let isLogin	= Router.matchRoute( this.authenticationRoute, event.path ).matched;

		// Authenticated and not login continue
		if ( session.authenticated && ! isLogin )
		{
			next();
		}
		// Not authenticated but is login let it pass
		else if ( ! session.authenticated && isLogin !== false )
		{
			next();
		}
		// Not authenticated go to login
		else if ( ! session.authenticated )
		{
			event.redirect( this.authenticationRoute );
		}
		else
		{
			event.redirect( this.indexRoute );
		}
	}
}

// Export the module
module.exports	= AuthenticationManager;
