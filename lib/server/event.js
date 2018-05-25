'use strict';

const url				= require( 'url' );
const TemplatingEngine	= require( './templating_engine' );
const events			= require( 'events' );

const eventEmitter		= new events.EventEmitter();

/**
 * @brief	Request event that holds all kinds of request data that is passed to all the middleware given by the router
 */
class RequestEvent
{
	/**
	 * @param	Object request
	 * @param	Object response
	 * @param	Object buffer
	 */
	constructor( request, response )
	{
		let parsedUrl	= url.parse( request.url, true );

		// Define read only properties of the Request Event
		Object.defineProperty( this, 'method', {
			value		: request.method.toUpperCase(),
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

		this.request			= request;
		this.response			= response;

		this.isStopped			= false;
		this.error				= null;
		this.internalTimeout	= null;
		this.handlerExtra		= {};
		this.extra				= {};
		this.cookies			= {};
		this.block				= {};

		let rawPayload			= [];
		this.parsedPayload		= false;

		this.getPayload			= async ( raw ) =>
		{
			return new Promise( ( resolve, reject ) =>
			{
				try
				{
					if ( this.parsedPayload )
					{
						resolve( rawPayload );
					}
					else
					{
						eventEmitter.once( 'payloadReceived', ()=>{
							resolve( rawPayload );
						});
					}
				}
				catch ( err )
				{
					reject( err );
				}
		    });
		};

		this.setChunk			= ( data ) => {
			rawPayload.push( data );
		};

		this.setPayload			= () => {
			rawPayload			= Buffer.concat( rawPayload );
			this.parsedPayload	= true;
			eventEmitter.emit( 'payloadReceived', rawPayload );
		};
	}

	/**
	 * @brief	Honestly don't know if it's necessary check if adding with once is OK? I don't want them to be able to do on!
	 * 			Consider changing this in the future to just payloadReceived
	 *
	 * @param	String key
	 * @param	Function callback
	 *
	 * @details	This is a way for the outside objects to attach to the events emitted
	 * 			by the eventEmitter of the RequestEvent
	 *
	 * @return	void
	 */
	once( key, callback )
	{
		eventEmitter.once( key, callback );
	}

	/**
	 * @brief	Returns whether the payload has been received
	 *
	 * @return	Boolean
	 */
	isPayloadParsed()
	{
		return this.parsedPayload;
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
	 * @brief	Outputs basic data about the request
	 *
	 * @param	Number level
	 *
	 * @todo	Absolutely log this somewhere else ( same for pretty much anywhere else but i don't wanna bother for now )
	 *
	 * @return	void
	 */
	logData( level )
	{
		level	= typeof level === 'number' ? level : 1;

		if ( level >= 1 )
		{
			let data	= {
				method				: this.method,
				path				: this.path
			};

			console.log( data );
		}

		if ( level >= 2 )
		{
			let data	= {
				headers				: this.headers,
				queryStringObject	: this.queryStringObject
			};

			console.log( data );
		}

		if ( level >= 3 )
		{
			let data	= {
				cookies	: this.cookies,
				payload	: this.payload,
				extra	: this.extra
			};

			console.log( data );
		}
	}

	/**
	 * @brief	Sets an error
	 *
	 * @param	Error error
	 *
	 * @return	void
	 */
	setError( error )
	{
		if ( typeof error !== 'string' )
		{
			error	= JSON.stringify( error );
		}

		this.serverError( error );
	}

	/**
	 * @brief	Safely set header to response ( only if response is not sent )
	 *
	 * @details	Will throw an error if response is sent ( but server error that will not kill the execution )
	 *
	 * @param	String key
	 * @param	String value
	 *
	 * @return	void
	 */
	setHeader( key, value )
	{
		if ( ! this.isFinished() )
		{
			this.response.setHeader( key, value );
		}
		else {
			this.setError( 'Trying to set headers when response is already sent' );
		}
	}

	/**
	 * @brief	Used to send a redirect response to a given redirectUrl
	 *
	 * @param	String redirectUrl
	 *
	 * @return	void
	 */
	redirect( redirectUrl )
	{
		this.response.writeHead( 302, { 'Location': redirectUrl } );
		this.response.end();
	}

	/**
	 * @brief	Clears the timeout event
	 *
	 * @return	void
	 */
	clearTimeout()
	{
		clearTimeout( this.internalTimeout );
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
				callback( err );
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
		if ( this.block.length <= 0 && ! this.isFinished() )
		{
			this.serverError( 'No middlewares left and response has not been sent.' );
			return;
		}

		if ( this.isStopped )
		{
			if ( ! this.isFinished() )
			{
				this.response.end();
			}

			return ;
		}

		let middleware	= this.block.shift();

		try
		{
			middleware( this );
		}
		catch ( error )
		{
			this.serverError( error );
		}
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
		else {
			console.log( 'Server error: ', message );
		}
	}
}

// Export The Module
module.exports	= RequestEvent;
