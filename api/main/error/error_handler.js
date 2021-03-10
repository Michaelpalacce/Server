'use strict';

//Dependencies
const ErrorHandler	= require( 'event_request/server/components/error/error_handler' );
const errorHandler	= new ErrorHandler();

errorHandler.addNamespace( 'app', { formatter: async ( { event, code, status, error, message, headers, emit } ) => {
		if ( event.getRequestHeader( 'x-requested-with' ) === 'XMLHttpRequest' || event.getRequestHeader( 'accepts' ) === 'application/json' )
			return errorHandler.defaultNamespace.formatter( { event, code, status, error, message, headers, emit } );

		return await event.render(
			'error',
			{
				code: status || 500,
				error: message || code || ErrorHandler.GENERAL_ERROR_CODE
			}
		).catch(() => {
			errorHandler.defaultNamespace.callback( { event, code, status, error, message, headers, emit } );
		});
	}}
);

module.exports	= errorHandler;
