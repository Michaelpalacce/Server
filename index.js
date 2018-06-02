'use strict';

// Dependencies
const envConfig		= require( './lib/config/env' );
const server		= require( './server' );
const tokenCleaner	= require( './handlers/main/token_cleaner' );

// Start the server
server.start( envConfig.port );

