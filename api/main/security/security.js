'use strict';

// Dependencies
const er			= require( 'event_request' )();
const UserManager	= require( '../user/user_manager' );
const Acl			= require( '../acls/acl' );
const app			= er.Router();
const crypto		= require( 'crypto' );
let isBootstrapped	= false;

async function bootstrap()
{
	if ( isBootstrapped )
		return;

	isBootstrapped	= true;
	const userData	= {
		username	: process.env.ADMIN_USERNAME,
		password	: crypto.createHash( 'sha256' ).update( process.env.ADMIN_PASSWORD ).digest( 'hex' ),
		roles		: [Acl.getRoles().root.name],
		permissions	: {},
		metadata	: {}
	};

	await UserManager.fetchUsers();

	// Recreate the Root user
	if ( ! UserManager.has( process.env.ADMIN_USERNAME ) )
		Acl.decorateUserWithPermissions( UserManager.set( userData ) );
	else
		Acl.decorateUserWithPermissions( UserManager.update( userData ) );
}

/**
 * @brief	Init middleware for the security
 *
 * @details	Starts the session
 * 			Sets the UserManager in the eventRequest
 */
app.add( async ( event ) => {
	await bootstrap();
	await event.initSession();
	event.$userManager	= UserManager;

	event.next();
});

/**
 * @brief	Add a logout route
 *
 * @details	Removes the session to logout hte user
 */
app.post( '/logout', async ( event ) => {
	await event.session.removeSession();

	event.send();
});

/**
 * @brief	Performs a login
 */
app.post( '/login', async ( event ) => {
	let result	= event.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

	if ( result.hasValidationFailed() )
		throw { code: 'app.security.unauthorized.missingCredentials' };

	const { username, password }	= result.getValidationResult();

	if ( ! event.$userManager.has( username ) )
		throw { code: 'app.security.unauthorized.userNotFound' };

	const user	= event.$userManager.get( username );
	Acl.decorateUserWithPermissions( user );

	if ( user.getPassword() === crypto.createHash( 'sha256' ).update( password ).digest( 'hex' ) )
	{
		event.session.add( 'username', user.getUsername() );

		return event.send();
	}

	throw { code: 'app.security.unauthorized.userInvalidCredentials' };
});

/**
 * @brief	Middleware for all requests, throws app.security.unauthenticated in case of an error
 *
 * @details	This will also set the user in the eventRequest as event.$user
 */
app.add({
	route	: /^\/api(?!\/login)(.*)/,
	handler	: ( event ) => {
		if ( ! event.session.has( 'username' ) )
			throw { code: 'app.security.unauthenticated' };

		const username	= event.session.get( 'username' );

		if ( ! event.$userManager.has( username ) )
			throw { code: 'app.security.unauthenticated' };

		event.$user	= event.$userManager.get( username );

		event.next();
	}
});

/**
 * @brief	Matches ALLOW and DENY permissions
 */
app.add(( event ) => {
	const permissions	= event.$user.getAllPermissions();

	if ( typeof permissions !== 'object' || ! Array.isArray( permissions.route ) )
		throw { code: 'app.security.forbidden', message: `You don\'t have permission to ${event.method} ${event.path}` }

	for ( const rule of permissions.route )
	{
		const type		= rule.type || 'DENY';
		const method	= rule.method || '';
		const route		= rule.route || '';

		if ( type === 'DENY' && er.router.matchMethod( event.method, method ) && er.router.matchRoute( event.path, route ) )
			throw { code: 'app.security.forbidden', message: `You don\'t have permission to ${event.method} ${event.path}` }
		else if ( type === 'ALLOW' && er.router.matchMethod( event.method, method ) && er.router.matchRoute( event.path, route ) )
			break;
	}

	event.next();
});

module.exports	= app;