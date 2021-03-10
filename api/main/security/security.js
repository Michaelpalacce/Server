'use strict';

// Dependencies
const app			= require( 'event_request' )();
const UserManager	= require( './user/user_manager' );
const userManager	= new UserManager();

// Add the default user if he/she does not exist.
app.add(( event ) => {
	event.userManager	= userManager;

	if ( ! userManager.has( process.env.ADMIN_USERNAME ) )
	{
		userManager.set({
			username	: process.env.ADMIN_USERNAME,
			password	: process.env.ADMIN_PASSWORD,
			permissions	: '[{"rules":[{"type":"ALLOW"}]}]',
			route		: '/'
		});
	}

	event.next();
});

// Initialize the session
app.add( async ( event ) => {
	await event.initSession();
	event.next();
});

require( './login' );
require( './permissions/permissions' );