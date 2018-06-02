'use strict';

// Dependencies
const envConfig		= require( './node_modules/event_request/config/env' );
const server		= require( './server' );
const tokenCleaner	= require( './handlers/main/token_cleaner' );

// Start the server
server.start( envConfig.port );

