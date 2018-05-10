'use strict';

// Dependencies
const RequestEvent	= require( './event' );

/**
 * @brief	Handler used to return all the needed middleware for the given event
 */
class Router
{
	/**
	 * @brief	Initializes the router with an empty middleware object
	 */
	constructor()
	{
		this.middleware	= [];
	}

	/**
	 * @brief	Function that adds a middleware to the block chain of the router
	 *
	 * @details	If only one argument is provided then that is set as a global middleware and should always be called
	 * 			If two arguments are provided then the first is expected to be the path and the second callback
	 * 			If three are provided then the first one is path, second method and third one is callback
	 * 			This method will throw na error if invalid parameters are provided
	 *
	 * @param	..args
	 *
	 * @returns	void
	 */
	add( args )
	{
		let route	= {};
		if ( args.length === 1 )
		{
			const callback	= args[0];

			if ( typeof callback !== 'function' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			route	= {
				callback	: callback,
				method		: '',
				path		: ''
			};
		}
		else if( args.length === 2 )
		{
			const path		= args[0];
			const callback	= args[1];

			if ( typeof callback !== 'function' || typeof path !== 'string' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			route	= {
				callback	: callback,
				method		: '',
				path		: path
			};
		}
		else if( args.length === 3 )
		{
			const path		= args[0];
			const callback	= args[1];
			const method	= args[2];

			if ( typeof callback !== 'function' || typeof path !== 'string' || typeof method !== 'string' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			route	= {
				callback	: callback,
				method		: method,
				path		: path
			};

		}
		else
		{
			throw new Error( 'Invalid middleware added!!' );
		}

		this.middleware.push( route );
	}

	/**
	 * @brief	This will process the request and return the appropriate block chain
	 *
	 * @param	RequestEvent event
	 *
	 * @return	Array
	 */
	getExecutionBlockForCurrentEvent( event )
	{
		if ( ! event instanceof RequestEvent )
		{
			throw new Error( 'Invalid Event provided' );
		}

		let block	= [];

		for ( let index in this.middleware )
		{
			let value	= this.middleware[index];
			if ( value.path === '' )
			{
				block.push( value.callback );
				continue;
			}

			if ( value.path === event.path )
			{
				if ( value.method === event.method || value.method === '' )
				{
					block.push( value.callback );
				}
			}
		}

		return block;
	}
}

// Export the module
module.exports	= Router;