'use strict';

// Dependencies
const app			= require( 'event_request' )();
const UserManager	= require( '../user/user_manager' );
const Session		= require( 'event_request/server/components/session/session' );
const Acl			= require( '../acls/acl' );

/**
 * @brief	Wait a bit so ACL can fetch roles
 */
setTimeout(()=>{
	// Creates root user if not exists
	if ( ! UserManager.has( process.env.ADMIN_USERNAME ) )
	{
		const root	= UserManager.set({
			username	: process.env.ADMIN_USERNAME,
			password	: process.env.ADMIN_PASSWORD,
			roles		: [Acl.getRoles().root.name]
		});
		Acl.decorateUserWithPermissions( root );

		const user	= UserManager.set({
			username	: 'test',
			password	: 'test',
			roles		: [Acl.getRoles().user.name]
		});
		Acl.decorateUserWithPermissions( user );

		user.getBrowseMetadata().setRoute( '/Test' );
	}
}, 200 );

/**
 * @brief	Init middleware for the security
 *
 * @TODO	IMPROVE THIS HORRIBLENESS ( I was lazy )
 *
 * @details	Starts the session
 * 			Sets the UserManager in the eventRequest
 * 			Works with gets that have a query token set ( for download )
 */
app.add( async ( event ) => {
	if ( event.method.toLowerCase() === 'get' && typeof event.query.token === 'string' )
	{
		const sessionId					= event.query.token;
		event.session.session.sessionId	= sessionId;
		event.session.session			= event.dataServer.get( Session.SESSION_PREFIX + sessionId )
	}
	else
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

	if ( user.getPassword() === password )
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
	route	: new RegExp( /^((?!\/login).)*$/ ),
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
		const type	= rule.type || 'DENY';

		if ( type === 'DENY' && app.router.matchRoute( event.path, rule.route ) && app.router.matchMethod( event.method, rule.methods || '' ) )
			throw { code: 'app.security.forbidden', message: `You don\'t have permission to ${event.method} ${event.path}` }
		else if ( type === 'ALLOW' && app.router.matchRoute( event.path, rule.route ) && app.router.matchMethod( event.method, rule.methods || '' ) )
			break;
	}

	event.next();
});