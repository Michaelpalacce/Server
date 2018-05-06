'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );

server.start( env_config.port );

server.add( 'test', ( event ) =>
	{
		event.response.end( 'MIDDLEWARE COMPLETE?' );
	}
);

server.add( '', ( event ) =>
{
	event.response.end( 'Hello' );
});