'use strict';

const { Server }	= require( 'event_request' );
const router		= Server().Router();

router.post( '/message', ( event )=>{
	let rules	= event.validationHandler.validate( event.body, { message : 'filled||string' } );

	if ( rules.hasValidationFailed() )
	{
		event.error( 'Validation failure.' );
		return;
	}

	const username	= event.session.get( 'username' );
	const message	= rules.getValidationResult().message;

	const Messages	= event.cachingServer.model( 'Messages' );
	const timestamp	= new Date().getTime();

	Messages.make( timestamp, { username, message } ).then( ()=>{
		event.send( ['OK'] );
	}).catch( event.next );
} );

module.exports		= router;
