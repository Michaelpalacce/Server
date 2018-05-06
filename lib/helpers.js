/**
 * Helpers for various tasks
 */

// Dependencies
const crypto		= require( 'crypto' );
const env_config	= require( './config/env' );

// Container for all the helpers
let helpers	= {};

// Create a SHA256 hash
helpers.hash	= ( str ) => {
	if ( typeof str === 'string' && str.length > 0 )
	{
		return crypto.createHmac( 'sha256', env_config.secret ).update( str ).digest( 'hex' );
	}
	else
	{
		return false;
	}
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject	= ( str ) => {
	try
	{
		return JSON.parse( str );
	}
	catch ( e )
	{
		return {};
	}
};

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString	= ( strLength ) =>{
	strLength	= typeof strLength === 'number' && strLength > 0 ? strLength : false;

	if ( strLength )
	{
		// Define all possible character that could go into a string
		let possibleCharacters	= 'abcdefghijklmnopqrstuvwxyz0123456789';

		// Start the final string
		let str				= '';

		for ( let i = 0; i <= strLength ; ++ i )
		{
			// Get a random character from the possible characters string
			// Append the character to the final string
			str	+= possibleCharacters.charAt( Math.floor( Math.random() * possibleCharacters.length ) );
		}
		return str;
	}
	else
	{
		return false;
	}
};

// Export the module
module.exports	= helpers;