'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const UserManager	= require( './user/user_manager' );

const app			= Server();
const userManager	= new UserManager();

// Add the default user if he/she does not exist.
app.add(( event )=>{
	event.userManager	= userManager;

	if ( ! userManager.has( process.env.ADMIN_USERNAME ) )
	{
		userManager.set({
			username	: process.env.ADMIN_USERNAME,
			password	: process.env.ADMIN_PASSWORD,
			isSU		: true,
			permissions	: [],
			route		: '/'
		});
	}

	event.next();
});

// Initialize the session
app.add( async ( event )=>{
	event.initSession( event.next ).catch( event.next );
});

// Add a logout route
app.get( '/logout', async ( event )=>{
	await event.session.removeSession();

	event.redirect( '/login', 302 );
});

// Add Security if it is enabled
if ( process.env.ENABLE_SECURITY == 1 )
{
	app.add({
		route	: new RegExp( /^((?!\/login).)*$/ ),
		handler	: ( event )=>{
			if ( ! event.session.has( 'authenticated' ) || event.session.get( 'authenticated' ) === false )
			{
				event.redirect( '/login' );
				return;
			}
			else
			{
				const username	= event.session.get( 'username' );
				const user		= userManager.get( username );

				event.session.add( 'route', user.getRoute() );
				event.session.add( 'SU', user.isSuperUser() );
				event.session.add( 'permissions', user.getPermissions() );
			}

			event.next();
		}
	});

	app.add(( event )=>{
			if ( event.session.has( 'permissions' ) )
			{
				const permissions	= event.session.get( 'permissions' );
				for ( const permission in permissions )
				{
					let method	= permissions[permission];
					try{ method	= JSON.parse( permissions[permission] ); } catch ( e ) {}

					if ( app.router.matchRoute( permission, event.path ) && app.router.matchMethod( event.method, method ) )
					{
						event.next( `You don\'t have permissinos to access: ${permission} with method: ${permissions[permission]}` );
					}
				}
			}

			event.next();
		}
	);

	app.get( '/login', ( event )=>{
		event.render( 'login' );
	}, 'cache.request' );

	app.post( '/login', async ( event )=>{
		let result	= event.validationHandler.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

		if ( result.hasValidationFailed() )
		{
			event.render( '/login' );
			return;
		}

		const { username, password }	= result.getValidationResult();

		if ( ! event.userManager.has( username ) )
		{
			return event.render( '/login' );
		}

		const user	= event.userManager.get( username );

		if ( user.getPassword() === password )
		{
			event.session.add( 'username', user.getUsername() );
			event.session.add( 'route', user.getRoute() );
			event.session.add( 'authenticated', true );
			event.session.add( 'SU', user.isSuperUser() );
			event.session.add( 'permissions', user.getPermissions() );

			event.redirect( '/' );
		}
		else
		{
			event.render( '/login' );
		}
	});
}
else
{
	app.add(( event )=>{
		event.session.add( 'route', '/' );
		event.session.add( 'username', process.env.ADMIN_USERNAME );
		event.session.add( 'authenticated', true );
		event.session.add( 'permissions', [] );
		event.session.add( 'SU', true );
		event.next();
	});

	app.get( '/login', ( event )=>{
		event.redirect( '/', 302 );
	}, 'cache.request');
}
