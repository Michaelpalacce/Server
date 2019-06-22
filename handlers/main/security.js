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

	result	= result.getValidationResult();
	
	if ( result.username === 'root' && result.password === 'toor' )
	{
		event.session.add( 'authenticated', true );
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
});

module.exports	= router;
