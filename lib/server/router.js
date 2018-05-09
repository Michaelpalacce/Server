'use strict';

/**
 * @brief	Handler used to return all the needed middleware for the given event
 */
class Router {
	constructor()
	{
		this.middleware	= [];
	}

	add( args )
	{

		if ( args.length === 1 )
		{
			const callback	= args[0];

			if ( typeof callback !== 'function' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			let route	= {
				callback	: callback,
				method		: '',
				path		: ''
			};

			this.middleware.push( route );
		}
		else if( args.length === 2 )
		{
			const path		= args[0];
			const callback	= args[1];

			let route	= {
				callback	: callback,
				method		: '',
				path		: path
			}

			this.middleware.push( route );
		}
		else if( args.length === 3 )
		{
			const path		= args[0];
			const method	= args[2];
			const callback	= args[1];

			let route	= {
				callback	: callback,
				method		: method,
				path		: path
			};

			this.middleware.push( route );
		}
		else
		{
			throw new Error( 'Invalid middleware added!!' );
		}
	}

	getExecutionBlockForCurrentEvent( event )
	{
		let block	= [];

		for ( let index in this.middleware )
		{
			let value	= this.middleware[index];
			console.log(this.middleware);
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
					continue;
				}
			}
		}

		return block;
	}
}

module.exports	= Router;
