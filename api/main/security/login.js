'use strict';

const app	= require( 'event_request' )();

app.get( '/login', ( event ) => {
	event.render( 'login' );
});

app.post( '/login', async ( event ) => {
	let result	= event.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

	if ( result.hasValidationFailed() )
		return event.redirect( '/login' );

	const { username, password }	= result.getValidationResult();

	if ( ! event.userManager.has( username ) )
		return event.redirect( '/login' );

	const user	= event.userManager.get( username );

	if ( user.getPassword() === password )
	{
		event.session.add( 'username', user.getUsername() );
		event.session.add( 'route', user.getRoute() );
		event.session.add( 'permissions', user.getPermissions() );

		return event.redirect( '/' );
	}

	event.redirect( 'login' );
});

// Middleware for all requests, redirects to login page if not authenticated
app.add({
	route	: new RegExp( /^((?!\/login).)*$/ ),
	handler	: ( event ) => {
		if ( ! event.session.has( 'username' ) )
			return event.redirect( '/login' );

		event.next();
	}
});

// Add a logout route
app.get( '/logout', async ( event ) => {
	await event.session.removeSession();

	event.redirect( '/login', 302 );
});