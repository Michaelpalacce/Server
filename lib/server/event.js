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

	render( templateName, variables )
	{
		this.templatingEngine.render( templateName, variables, ( result ) =>{
			this.response.end( result );
		});
	}
}

module.exports	= RequestEvent;