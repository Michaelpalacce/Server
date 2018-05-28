'use strict';

// Dependencies
const server		= require( './lib/www' );
const env_config	= require( './lib/config/env' );
const handlers		= require( './handlers/handlers' );
const security		= require( './handlers/main/security/security' );
const fs			= require( 'fs' );

server.use( 'timeout', { timeout : 60 } );
server.use( 'addStaticPath', { path : env_config.staticPath } );
server.use( 'addStaticPath', { path : 'favicon.ico' } );
server.use( 'parseCookies' );
server.use( 'formParser', { maxPayloadLength : 1048576 } );

//Authentication middleware
server.add( security );

server.use( 'multipartParser', { BufferSize : 5242880 } );
server.use( 'logger', { level : 1 } );

// Handlers
server.add( handlers );

server.add( '/test/:testParam:/:testParamTwo:', 'GET', ( event ) =>{
	console.log( 'matched' );
	event.next();
});

// Add a 404 NOT FOUND middleware
server.add( ( event ) => {
	if ( ! event.isFinished() )
	{
		event.response.setHeader( 'Content-Type', 'text/html' );
		event.response.statusCode	= 404;
		event.render( 'not_found', { message: '404 NOT FOUND' }, ( err )=>{
			if ( err )
				event.serverError( 'Could not render template' );
		});
	}
});

// Start the server
server.start( env_config.port );

// Clean up tokens
setInterval( () => {

	let directory	= './.data/tokens';
	fs.readdir( directory, {}, ( err, data ) =>{
		if ( ! err )
		{
			for ( let index in data )
			{
				let file		= data[index];
				let filename	= directory + '/' + file;
				fs.readFile( filename, {}, ( err, data ) => {
					try
					{
						let fileData	= JSON.parse( data.toString( 'ascii' ) );
						if ( fileData.expires <= Date.now() )
						{
							fs.unlink( filename, ( err ) =>{
								if ( err )
								{
									console.log( err );
								}
							});
						}
					}
					catch ( e )
					{
						console.log( 'Could not parse file' );
					}
				});
			}
		}
	});
}, env_config.tokenGarbageCollector );
