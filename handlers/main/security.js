'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const path			= require( './path' );

const router		= Server().Router();

// Initialize the session
router.add( async ( event )=>{
	event.initSession( event.next ).catch( event.next );
});

if ( process.env.SECURITY_ENABLED == true )
{
	router.add(( event )=>{
		if (
			event.path !== '/login'
			&& ( ! event.session.has( 'authenticated' ) || event.session.get( 'authenticated' ) === false )
		) {
			event.redirect( '/login' );
			return;
		}

		event.next();
	});

	router.get( '/login', ( event )=>{
		event.cacheCurrentRequest();
	});

	router.get( '/login', ( event )=>{
		event.render( 'login' );
	});

	router.post( '/login', async ( event )=>{
		let result	= event.validationHandler.validate( event.body, { username : 'filled||string', password : 'filled||string' } );

		if ( result.hasValidationFailed() )
		{
			event.render( '/login' );
			return;
		}

		result			= result.getValidationResult();
		let cacheServer	= Server().getPlugin( 'er_cache_server' );
		let dataServer	= cacheServer.getServer();

		const dataSet	= await dataServer.get( result.username );

		if ( dataSet !== null && typeof dataSet.value.password === 'string' && dataSet.value.password === result.password )
		{
			const route	= typeof dataSet.value.route !== 'undefined' ? dataSet.value.route : path.getRootDir();

			event.session.add( 'username', dataSet.key );
			event.session.add( 'authenticated', true );
			event.session.add( 'route', route );

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
	router.add(( event )=>{
		event.session.add( 'route', '/' );
		event.next();
	})
}

module.exports	= router;
