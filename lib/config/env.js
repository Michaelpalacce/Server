'use strict';

// Create a config container
let config				= {};

let requiredVariables	= {
	name		: '',
	secret		: '',
	staticPath	: '',
	port		: 0
};

config.dev				= {};
config.dev.name			= 'dev';
config.dev.port			= 3000;
config.dev.secret		= 'secret';
config.dev.staticPath	= 'public';

config.prod				= {};

// Determine which environment was passed as a command-line argument
let currentEnvironment	= typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments stated above, if not, default to staging
let environment			= typeof config[currentEnvironment] === 'object'
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
