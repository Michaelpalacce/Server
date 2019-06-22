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

	const User		= dataServer.model( 'User' );

	User.find( result.username ).then( ( model )=>{
		if ( model !== null && typeof model.recordData !== 'undefined' && model.recordData.password === result.password )
		{
			const path	= typeof model.recordData.route !== 'undefined' ? model.recordData.route : '\\';

			event.session.add( 'authenticated', true );
			event.session.add( 'path', path );

			event.session.saveSession( ( err )=>{
				if ( ! err )
				{
					event.redirect( '/' );
				}
				else
				{
					event.render( '/login' );
				}
			} );
		}
		else
		{
			event.render( '/login' );
		}
	}).catch( event.next );
});

module.exports	= router;
