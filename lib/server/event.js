'use strict';

const url				= require( 'url' );
const TemplatingEngine	= require( './templating_engine' );

/**
 * @brief	Request event that holds all kinds of request data that is passed to all the middleware given by the router
 */
class RequestEvent
{
	/**
	 * @param	Object request
	 * @param	Object response
	 */
	constructor( request, response )
	{
		let parsedUrl			= url.parse( request.url, true );

		// Define read only properties of the Request Event
		Object.defineProperty( this, 'method', {
			value		: request.method.toLowerCase(),
			writable	: false
		});

		Object.defineProperty( this, 'headers', {
			value		: request.headers,
			writable	: false
		});

		Object.defineProperty( this, 'templatingEngine', {
			value		: new TemplatingEngine(),
			writable	: false
		});

		Object.defineProperty( this, 'queryStringObject', {
			value		: parsedUrl.query,
			writable	: false
		});

		Object.defineProperty( this, 'path', {
			value		: parsedUrl.pathname.trim(),
			writable	: false
		});

		this.response			= response;
		this.isStopped			= false;

		this.handlerExtra		= {};
		this.extra				= {};
		this.block				= {};
	}

	/**
	 * @brief	Stops block execution
	 *
	 * @return	void
	 */
	stop()
	{
		this.isStopped	= true;
	}

	/**
	 * @brief	Checks if the response is finished
	 *
	 * @return	Boolean
	 */
	isFinished()
	{
		return this.response.finished;
	}

	/**
	 * @see	TemplatingEngine::render()
	 */
	render( templateName, variables, callback )
	{
		this.templatingEngine.render( templateName, variables, ( err, result ) => {
			if ( ! err && result && result.length > 0 )
			{
				this.response.end( result );
			}

			callback( err );
		});
	}

	/**
	 * @brief	Sets the current execution block
	 *
	 * @param	Array block
	 *
	 * @return	void
	 */
	setBlock( block )
	{
		this.block	= block;
	}

	/**
	 * @brief	Calls the next middleware in the execution block
	 *
	 * @details	if there is nothing else to send and the response has not been sent YET, then send a server error
	 * 			if the event is stopped and the response has not been set then send a server error
	 * 			Clean up the handlerExtra container.
	 *
	 * @return	void
	 */
	next()
	{
		this.handlerExtra	= {};
		if ( this.isStopped || this.block.length <= 0 )
		{
			this.serverError();
			return;
		}

		let middleware	= this.block.shift();
		middleware( this );
	}

	/**
	 * @brief	Will send a server error in case a response has not been send already
	 *
	 * @return	void
	 */
	serverError( message = '' )
	{
		if ( ! this.isFinished() )
		{
			this.response.statusCode	= 500;
			this.response.end( message );
		}
	}
}

// Export The Module
module.exports	= RequestEvent;
