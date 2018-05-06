'use strict';

// Dependencies
const http					= require( 'http' );
const url					= require( 'url' );
const StringDecoder			= require( 'string_decoder' ).StringDecoder;
const Router				= require( './router' );

class Server
{
	constructor()
	{
		this.server		= {};

		this.middleware	= {
			global			: [],
			pathSpecific	: {}
		};
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
		if ( arguments.length === 1 )
		{
			const callback	= arguments[0];

			if ( typeof callback !== 'function' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			this.middleware.global.push( callback );
		}
		else if( arguments.length === 2 )
		{
			const path		= arguments[0];
			const callback	= arguments[1];

			if ( typeof this.middleware.pathSpecific[path] === 'undefined' )
			{
				this.middleware.pathSpecific[path]	= [];
			}

			this.middleware.pathSpecific[path].push( callback );
		}
		else
		{
			throw new Error( 'Invalid middleware added!!' );
		}
	};

	/**
	 * @brief	Resolves all the middleware given the request and response
	 *
	 * @return	Object
	 */
	resolve ( request, response )
	{
		// Get the URL and parse it
		let parsedUrl			= url.parse( request.url, true );

		// Get the path
		let path				= parsedUrl.pathname;
		let trimmedPath			= path.replace( /^\/+|\/+$/g,'' );

		// Get the query parameters
		let queryStringObject	= parsedUrl.query;

		// Get the HTTP Method
		let method				= request.method.toLowerCase();

		// Get the headers as an object
		let headers				= request.headers;

		let event	= {
			middleware			: this.middleware,
			path				: trimmedPath,
			method				: method,
			queryStringObject	: queryStringObject,
			headers				: headers,
			request				: request,
			response			: response,
			extra				: {},
			isStopped			: false,
			isFatal				: false,
			fatal				: () => { event.isFatal	= true; },
			stop				: () => { event.isStopped	= true; }
		};

		return event;
	};

	start ( port )
	{
		// Create the server
		this.server			= http.createServer( ( req, res ) =>
			{
				// Get the payload, if any
				let decoder				= new StringDecoder( 'utf-8' );
				let buffer				= '';

				req.on( 'data', ( data ) => {
					buffer	+= decoder.write( data );
				});

				req.on( 'end', () => {
					buffer	+= decoder.end();

					let event	= this.resolve( req, res );
					let router	= new Router( event );
					let block	= router.getExecutionBlock();
					for ( let index in block )
					{
						block[index]( event );
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