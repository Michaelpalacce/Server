'use strict';

// Dependencies
const http					= require( 'http' );
const StringDecoder			= require( 'string_decoder' ).StringDecoder;
const Router				= require( './server/router' );
const RequestEvent			= require( './server/event' );

/**
 * @brief	Server class responsible for receiving requests and sending responses
 */
class Server
{
	constructor()
	{
		this.server		= {};
		this.router		= new Router();
	}

	/**
	 * @brief	Function that adds a middleware to the event loop of the router
	 *
	 * @param	..args
	 *
	 * @returns	void
	 */
	add()
	{
		this.router.add( arguments );
	};

	/**
	 * @brief	Resolves the given request and response
	 *
	 * @details	Creates a RequestEvent used by the Server with helpful methods
	 *
	 * @return	RequestEvent
	 */
	static resolve ( request, response )
	{
		return new RequestEvent( request, response );
	};

	/**
	 * @brief	Starts the server on a given port
	 *
	 * @param	Number port
	 *
	 * @return	void
	 */
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

		this.server.listen( port, () =>
			{
				console.log( 'Server successfully started and listening on port ', port );
			}
		);
	}
}

// Export the server module
module.exports			= new Server();