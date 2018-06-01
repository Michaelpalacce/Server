'use strict';

// Dependencies
const http					= require( 'http' );
const middlewaresContainer	= require( './server/middleware_container' );
const Router				= require( './server/router' );
const RequestEvent			= require( './server/event' );

/**
 * @brief	Server class responsible for receiving requests and sending responses
 */
class Server
{
	constructor()
	{
		this.server	= {};
		this.router	= new Router();
	}

	/**
	 * @brief	Function that adds a middleware to the block chain of the router
	 *
	 * @param	..args
	 *
	 * @returns	void
	 */
	add()
	{
		const args	= Array.from( arguments );
		this.router.add.apply( this.router, args );
	};

	/**
	 * @brief	Use a predefined middleware from middlewaresContainer
	 *
	 * @param	String name
	 * @param	Object options
	 *
	 * @return	void
	 */
	use( name, options )
	{
		if ( typeof name === 'string' && typeof middlewaresContainer[name] === 'function' )
		{
			this.add.apply( this, middlewaresContainer[name]( options ) );
		}
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
		this.server			= http.createServer( ( req, res ) => {
			let requestEvent	= Server.resolve( req, res );

			res.on( 'finish', () => {
				requestEvent.stop();
				requestEvent.clearTimeout();
				requestEvent	= null;
			});

			res.on( 'error', ( error ) => {
				requestEvent.stop();
				requestEvent.clearTimeout();
				requestEvent	= null;
				console.log( error );
			});

			setTimeout( () => {
				let block	= this.router.getExecutionBlockForCurrentEvent( requestEvent );
				requestEvent.setBlock( block );
				requestEvent.next();
			});
		});

		this.server.listen( port, () =>
			{
				console.log( 'Server successfully started and listening on port', port );
			}
		);

		// Add an error handler in case of an error.
		this.server.on( 'error', ( err )=>{
			console.log( 'Could not start the server on port: ', port );
			console.log( 'Error Returned was: ', err.code );
		});
	}
}

// Export the server module
module.exports	= new Server();
