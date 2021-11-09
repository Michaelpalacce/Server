'use strict';

//Dependencies
const ErrorHandler	= require( 'event_request/server/components/error/error_handler' );
const errorHandler	= new ErrorHandler();

errorHandler.addNamespace( 'app.input', { status: 400 } );
errorHandler.addNamespace( 'app.browse', { status: 400 } );

errorHandler.addNamespace( 'app.security.unauthorized', { status: 401, message: 'Invalid credentials' } );
errorHandler.addNamespace( 'app.security.unauthenticated', { status: 401, message: 'User unauthenticated' } );

errorHandler.addNamespace( 'app.security.forbidden', { status: 403 } );

module.exports	= errorHandler;
