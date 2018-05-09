'use strict';

/**
 * @brief	Handler used to return all the needed middleware for the given event
 */
class Router {
	constructor()
	{
		this.middleware	= {
			global			: [],
			pathSpecific	: {}
		};
	}

	add( args )
	{
		if ( args.length === 1 )
		{
			console.log( args );

			const callback	= args[0];

			if ( typeof callback !== 'function' )
			{
				throw new Error( 'Invalid middleware added!!' );
			}

			this.middleware.global.push( callback );
		}
		else if( args.length === 2 )
		{
			const path		= args[0];
			const callback	= args[1];

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
	}

	getExecutionBlockForCurrentEvent( event )
	{
		let block	= [];

		for ( let globalIndex in this.middleware.global )
		{
			block.push( this.middleware.global[globalIndex] );
		}

		for ( let pathIndex in this.middleware.pathSpecific )
		{
			if ( pathIndex === event.path )
			{
				for ( let index in this.middleware.pathSpecific[pathIndex] )
				{
					block.push( this.middleware.pathSpecific[pathIndex][index] );
				}
			}
		}

		return block;
	}
}

module.exports	= Router;