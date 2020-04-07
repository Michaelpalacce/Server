'use strict';

// Dependencies
const copyFolder	= require( '../handlers/main/utils/copyFolder' );
const path			= require( 'path' );
const argv			= process.argv.slice( 2 );

//Run only if 2 parameters are passed
if ( argv.length !== 2 )
{
	console.log( 'Invalid amount of arguments given' );
	process.exit( 1 );
}

const from	= path.resolve( argv[0] );
const to	= path.resolve( argv[1] );

copyFolder( from, to ).then(()=>{
	console.log( 'Project setup finished.' );
	console.log( 'You should open up the .env file and change the root credentials as a first step.' );
	console.log( 'Check the README for more information about the project.' );
	console.log( 'To start the app:' );
	console.log( 'npm start' );
}).catch(( err )=>{
	console.log( err );
	process.exit( 1 );
});