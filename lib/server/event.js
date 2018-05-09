'use strict';

const url				= require( 'url' );
const TemplatingEngine	= require( './templating_engine' );

class RequestEvent
{
	constructor( request, response )
	{
		let parsedUrl			= url.parse( request.url, true );
		this.path				= parsedUrl.pathname.replace( /^\/+|\/+$/g,'' );
		this.queryStringObject	= parsedUrl.query;
		this.method				= request.method.toLowerCase();
		this.headers			= request.headers;
		this.response			= response;
		this.extra				= {};
		this.isStopped			= false;
		this.isFatal			= false;
		this.templatingEngine	= new TemplatingEngine();
		this.block				= {};
	}

	fatal()
	{
		this.isFatal	= true;
	}

	stop()
	{
		this.isStopped	= true;
	}

	isFinished()
	{
		return this.response.finished;
	}

	render( templateName, variables, callback )
	{
		this.templatingEngine.render( templateName, variables, ( err, result ) =>{
			if ( ! err && result && result.length > 0 )
			{
				this.response.end( result );
				callback( err );
				return;
			}

			callback( err );
		});
	}

	setBlock( block )
	{
		this.block	= block;
	}

	next()
	{
		if ( this.block.length <= 0 )
		{
			return;
		}
		let middleware	= this.block.shift();
		middleware.call( this, this );
	}
}

module.exports	= RequestEvent;
