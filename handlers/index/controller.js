'use strict';

// Dependencies
const Router	= require( './../../lib/server/router' );
const model		= require( './model/index_module' );


let router		= new Router();

router.add( '/', 'GET', ( event ) =>
	{
		model.get( event, ( err, data )=>
			{
				if ( ! err && data )
				{
					event.render( 'index', data, ( err ) =>{
						if ( err )
						{
							event.next();
						}
					});
				}
				else
				{
					event.next();
				}
			}
		);
	}
);

module.exports	= router;
