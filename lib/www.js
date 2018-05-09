'use strict';

// Dependencies
const http					= require( 'http' );
const StringDecoder			= require( 'string_decoder' ).StringDecoder;
const Router				= require( './server/router' );
const RequestEvent					= require( './server/event' );

class Server
{
	constructor()
	{
		this.server		= {};
		this.router		= new Router();
	}

	/**
	 * @brief	Function that adds a middleware to the container
	 *
	 * @param	name
	 * @param	middleware
	 *
	 * @returns	void
	 */
	add()
	{
		this.router.add( arguments );
	};

	/**
	 * @brief	Resolves all the middleware given the request and response
	 *
	 * @return	RequestEvent
	 */
	static resolve ( request, response )
	{
		return new RequestEvent( request, response );
	};

	start ( port )
	{
		// Create the server
		this.server			= http.createServer( ( req, res ) =>
			{
				// Get the payload, if any
				let decoder	= new StringDecoder( 'utf-8' );
				let buffer	= '';

				req.on( 'data', ( data ) => {
					buffer	+= decoder.write( data );
				});

				req.on( 'end', () => {
					buffer	+= decoder.end();

					let requestEvent	= Server.resolve( req, res );
					let block			= this.router.getExecutionBlockForCurrentEvent( requestEvent );
					for ( let index in block )
					{
						block[index]( requestEvent );
					}
					if ( ! requestEvent.isFinished() )
					{
						res.setHeader( 'Content-Type', 'text/html' );
						res.statusCode	= 404;
						requestEvent.render( 'not_found', { times: 2, message:'404 NOT FOUND'}, ( err, data )=>{
							if ( ! err && data && data.length > 0 )
							{
								res.end( data );
							}
						});
					}
				});
			}
		);

		// Set the server to listen on the given port
		this.server.listen( port, () =>
			{
				console.log( 'Server successfully started and listening on port ', port );
			}
		);
	}
}

// Export the server module
module.exports			= new Server();

// // Choose the handler this request should go to. If one is not found use the notFound handler
// let chosenHandler	= ( typeof  router[trimmedPath] !== 'undefined' ) ? router[trimmedPath] : handlers.notFound;
//
// // Construct the data object to send to the handler
// let data			= {
// 	trimmedPath			: trimmedPath,
// 	queryStringObject	: queryStringObject,
// 	method				: method,
// 	headers				: headers,
// 	payload				: helpers.parseJsonToObject( buffer )
// };
//
// // Route the request to the handler specified in the router
// chosenHandler( data, ( statusCode, payload ) => {
// 	// Use the status code called back by the handler, or default to 200
// 	statusCode	= ( typeof statusCode === 'number' ) ? statusCode : 200;
//
// 	// Use the payload called back by the handler, or default to empty object
// 	payload		= ( typeof payload === 'object' ) ? payload : {};
//
// 	// Convert the payload to a string
// 	let payloadString	= JSON.stringify( payload );
//
// 	// Return the response
// 	res.setHeader( 'Content-Type', 'application/json' );
// 	res.writeHead( statusCode );
// 	res.end( payloadString );
//
// 	// Log the response
// 	console.log( 'Returning this response: ', statusCode, payloadString );
// });