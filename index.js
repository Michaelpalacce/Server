'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );

server.start( env_config.port );

server.add( '', ( event ) => {
	event.render( 'index', {}, ( err ) =>{
		if ( err )
		{
			event.next();
		}
	} );
});

server.add( ( event ) => {
	console.log('boom');
	if ( ! event.isFinished() )
	{
		event.response.setHeader( 'Content-Type', 'text/html' );
		event.response.statusCode	= 404;
		event.render( 'not_found', { times: 2, message:'404 NOT FOUND'}, ( err, data )=>{
			if ( ! err && data && data.length > 0 )
			{
				res.end( data );
			}
		});
	}
})
