'use strict';

const app	= require( 'event_request' )();

app.post( '/login', async ( event ) => {
	let result	= event.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

	if ( result.hasValidationFailed() )
		throw { code: 'app.security.unauthorized.missingCredentials' };

	const { username, password }	= result.getValidationResult();

	if ( ! event.userManager.has( username ) )
		throw { code: 'app.security.unauthorized.userNotFound' };

	const user	= event.userManager.get( username );

	if ( user.getPassword() === password )
	{
		event.session.add( 'username', user.getUsername() );
		event.session.add( 'route', user.getRoute() );
		event.session.add( 'permissions', user.getPermissions() );

		return event.send( 'OK' );
	}

	throw { code: 'app.security.unauthorized.userInvalidCredentials' };
});

// Middleware for all requests, redirects to login page if not authenticated
app.add({
	route	: new RegExp( /^((?!\/login).)*$/ ),
	handler	: ( event ) => {
		if ( ! event.session.has( 'username' ) )
			throw { code: 'app.security.unauthorized' };

		event.next();
	}
});

// Add a logout route
app.post( '/logout', async ( event ) => {
	await event.session.removeSession();

	event.send();
});