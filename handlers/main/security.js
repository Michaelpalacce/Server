'use strict';

// Dependencies
const { Server }	= require( 'event_request' );

const router		= Server().Router();

// Initialize the session
router.add({
	handler	: ( event )=>{
		event.initSession( event.next );
	}
});

router.add({
	handler	: ( event )=>{
		if (
			event.path !== '/login'
			&& ( ! event.session.has( 'authenticated' ) || event.session.get( 'authenticated' ) === false )
		) {
			event.redirect( '/login' );
		}

		event.next();
	}
});

router.get( '/login', ( event )=>{
	event.cacheCurrentRequest();
});

router.get( '/login', ( event )=>{
	event.render( 'login' );
});

router.post( '/login', ( event )=>{
	let result	= event.validationHandler.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

	if ( result.hasValidationFailed() )
	{
		event.render( '/login' );
		return;
	}

	result			= result.getValidationResult();
	let cacheServer	= Server().getPlugin( 'er_cache_server' );
	let dataServer	= cacheServer.getServer();

	const dataSet	= dataServer.get( result.username );

	if ( dataSet !== null && typeof dataSet.value.password === 'string' && dataSet.value.password === result.password )
	{
		const route	= typeof dataSet.value.route !== 'undefined' ? dataSet.value.route : '\\';

		event.session.add( 'username', dataSet.key );
		event.session.add( 'authenticated', true );
		event.session.add( 'route', route );

		if ( ! event.session.saveSession() )
		{
			event.render( '/login' );
		}
		else
		{
			event.redirect( '/' );
		}
	}
	else
	{
		event.render( '/login' );
	}
});

module.exports	= router;
