'use strict';

// Create a config container
let config							= {};

let requiredVariables				= {
	name					: '',
	secret					: '',
	username				: '',
	password				: '',
	staticPath				: '',
	tokenExpiration			: 0,
	requestTimeout			: 0,
	tokenGarbageCollector	: 0,
	port					: 0
};

config.dev							= {};
config.dev.name						= 'dev';
config.dev.port						= 3000;
config.dev.secret					= 'secret';
config.dev.username					= 'root';
config.dev.password					= 'toor';
config.dev.staticPath				= 'public';
config.dev.tokenExpiration			= 3600 * 1000;
config.dev.requestTimeout			= 2 * 1000;
config.dev.tokenGarbageCollector	= 5 * 1000;
config.prod							= {};

// Determine which environment was passed as a command-line argument
let currentEnvironment				= typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments stated above, if not, default to staging
let environment						= typeof config[currentEnvironment] === 'object'
									? config[currentEnvironment]
									: config.dev;

// Check that all required keys are set
for ( const key in requiredVariables )
{
	const value	= requiredVariables[key];

	if ( typeof environment[key] === 'undefined' || environment[key] === value )
	{
		throw new Error( 'Invalid configuration provided' );
	}
}

module.exports	= environment;
