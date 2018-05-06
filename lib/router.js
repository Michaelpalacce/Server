'use strict';

/**
 * @brief	Handler used to return all the needed middleware for the given event
 */
class Router {
	constructor( event )
	{
		this.block	= [];

		for ( let globalIndex in event.middleware.global )
		{
			this.block.push( event.middleware.global[globalIndex] );
		}

		for ( let pathIndex in event.middleware.pathSpecific )
		{
			if ( pathIndex === event.path )
			{
				for ( let index in event.middleware.pathSpecific[pathIndex] )
				{
					this.block.push( event.middleware.pathSpecific[pathIndex][index] );
				}
			}
		}

		delete event.middleware;
	}

	getExecutionBlock()
	{
		return this.block;
	}
}

module.exports	= Router;