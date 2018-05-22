'use strict';

// Dependencies
const http					= require( 'http' );
const StringDecoder			= require( 'string_decoder' ).StringDecoder;
const fs					= require( 'fs' );
const path					= require( 'path' );
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
		this.server		= {};
		this.router		= new Router();
		this.timeout	= 0;
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
		const args = Array.from( arguments );
		this.router.add.apply( this.router, args );
	};

	/**
	 * @brief	Use a predefined middleware from middlewaresContainer
	 *
	 * @param	String name
	 *
	 * @return	void
	 */
	use( name )
	{
		if ( typeof name === 'string' && typeof middlewaresContainer[name] === 'function' )
		{
			this.add( middlewaresContainer[name] );
		}
	};

	/**
	 * @brief	Sets the given path as the static path where resources can be delivered easily
	 *
	 * @param	string staticPath
	 *
	 * @return	void
	 */
	addStaticPath( staticPath )
	{
		let regExp	= new RegExp( '^(\/' + staticPath + ')' );

		this.add( regExp, ( event ) => {
			let item	= path.join( __dirname + '/../' + event.path );
			fs.readFile( item, {}, ( err, data ) => {
				if ( ! err && data )
				{
					event.response.end( data )
				}
				else
				{
					event.setError( 'File not found' );
				}
			});
		});
	}

	/**
	 * @brief	Logs information about the current event
	 *
	 * @details	This should ideally be used after the static path middleware.
	 *
	 * @param	RequestEvent event
	 *
	 * @return	void
	 */
	logger( level )
	{
		this.add( ( event ) => {
			event.logData( level );
			event.next();
		} );
	};


	/**
	 * @brief	Resolves the given request and response
	 *
	 * @details	Creates a RequestEvent used by the Server with helpful methods
	 *
	 * @return	RequestEvent
	 */
	static resolve ( request, response, buffer )
	{
		return new RequestEvent( request, response, buffer );
	};

	/**
	 * @brief	Starts the server on a given port
	 *
	 * @param	Number port
	 *
	 * @return	void
	 */
	start ( port, timeout = 60 )
	{
		this.timeout	= timeout;

		// Create the server
		this.server			= http.createServer( ( req, res ) => {
			// Get the payload, if any
			let decoder	= new StringDecoder( 'utf-8' );
			let buffer	= '';

			req.on( 'data', ( data ) => {
				buffer	+= decoder.write( data );
			});

			req.on( 'end', () => {
				buffer	+= decoder.end();

				let requestEvent	= Server.resolve( req, res, buffer );
				let block			= this.router.getExecutionBlockForCurrentEvent( requestEvent );

				requestEvent.setBlock( block );

				requestEvent.internalTimeout	= setTimeout( () => {
					console.log( 'Request timed out' );
						if ( ! requestEvent.isFinished() )
						{
							requestEvent.serverError( 'TIMEOUT' );
						}
					},
					2 * 1000
				);

				res.on( 'finish', () => {
					requestEvent.stop();
					clearTimeout( requestEvent.internalTimeout );
				});

				res.on( 'error', ( error ) => {
					console.log( error );
				});

				requestEvent.next();
			});
		});

		this.server.listen( port, () =>
			{
				console.log( 'Server successfully started and listening on port', port );
			}
		);
	}
}

// Export the server module
module.exports			= new Server();
