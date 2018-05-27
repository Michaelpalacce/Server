'use strict';

// Dependencies
const url				= require( 'url' );
const TemplatingEngine	= require( './templating_engine' );
const events			= require( 'events' );

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

		Object.defineProperty( this, 'eventEmitter', {
			value		: new events.EventEmitter(),
			writable	: true
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
		this.parsedPayload		= false;

		let rawPayload			= [];
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
						this.eventEmitter.once( 'payloadReceived', ()=>{
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
			this.eventEmitter.emit( 'payloadReceived', rawPayload );
		};
	}

	/**
	 * @brief	Attaches a callback to a specific event just once after which the
	 * 			Callback is removed from the event emitter queue
	 *
	 * @param	String key
	 * @param	Function callback
	 *
	 * @details	This is a way for the outside objects to attach to the events emitted
	 * 			by the eventEmitter of the RequestEvent
	 * 			It is recommended to use once rather than ON
	 *
	 * @return	void
	 */
	once( key, callback )
	{
		this.eventEmitter.once( key, callback );
	}

	/**
	 * @brief	Attaches a callback to a specific event
	 *
	 * @param	String key
	 * @param	Function callback
	 *
	 * @details	This is a way for the outside objects to attach to the events emitted
	 * 			by the eventEmitter of the RequestEvent
	 *
	 * @return	void
	 */
	on( key, callback )
	{
		this.eventEmitter.on( key, callback );
	}

	/**
	 * @brief	Get the event emitter of the RequestEvent
	 *
	 * @param	String key
	 * @param	mixed data
	 *
	 * @return	EventEmitter
	 */
	emit( key, data )
	{
		this.eventEmitter.emit( key, data );
	}

	/**
	 * @brief	Sends the response to the user
	 *
	 * @param	mixed response
	 * @param	Number code
	 *
	 * @return	void
	 */
	setResponse( response, code = 200, raw = false )
	{
		if ( raw === true )
		{
			this.response.statusCode	= code;
			this.response.end( response );
		}
		else
		{
			try{
				response	= typeof response === 'string' ? response : JSON.parse( response );
			}
			catch ( e )
			{
				response	= '';
			}

			this.response.statusCode	= typeof code === 'number' ? code : 200;
			this.response.end( response );
		}
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
	 * @param	mixed error
	 * @param	Number code
	 *
	 * @return	void
	 */
	setError( error, code )
	{
		if ( typeof error !== 'string' )
		{
			error	= JSON.stringify( error );
		}

		this.serverError( error, code );
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
		this.setResponse();
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
				this.setResponse( result, 200, true );
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
				this.setResponse();
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
	serverError( message = '', code = 500 )
	{
		if ( ! this.isFinished() )
		{
			this.setResponse( message, code );
		}
		else {
			console.log( 'Server error: ', message );
		}
	}
}

// Export The Module
module.exports	= RequestEvent;
