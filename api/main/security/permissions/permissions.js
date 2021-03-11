'use strict';

const app	= require( 'event_request' )();

app.add(( event ) => {
	for ( const rule of event.session.get( 'permissions' ) )
	{
		const type		= rule.type || 'DENY';
		const methods	= rule.methods || '';
		const route		= rule.route;
		const ruleMatch	= app.router.matchRoute( event.path, route ) && app.router.matchMethod( event.method, methods );

		if ( type === 'DENY' && ruleMatch )
			throw { code: 'app.security.forbidden', message: `You don\'t have permission to ${event.method} ${event.path}` }
		else if ( type === 'ALLOW' && ruleMatch )
			break;
	}

	event.next();
});