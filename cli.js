#!/usr/bin/env node
'use strict';

const pm2				= require( 'pm2' );
const { exec, spawn }	= require( 'child_process' );
const path				= require( 'path' );
const fs				= require( 'fs' );

const args				= process.argv.slice( 2 );

const projectDir		= path.parse( require.main.filename ).dir;
const ENV_FILE			= path.join( projectDir, 'env.js' );

// Create a env file if one does not exist
if ( ! fs.existsSync( ENV_FILE ) )
	fs.copyFileSync( `${ENV_FILE}.template`, ENV_FILE );

function getCommandLine()
{
	switch ( process.platform )
	{
		case 'darwin':
			return 'open';
		case 'win64':
		case 'win32':
			return 'start';
		default:
			return 'xdg-open';
	}
}

pm2.connect(( err ) => {
	if ( err )
	{
		console.error( err );
		process.exit( 2 );
	}

	switch ( true )
	{
		case args.length === 0:
		case args.length === 1 && args[0] === 'start':
			pm2.start( `${projectDir}/ecosystem.config.js`, ( err, apps ) => {
				pm2.disconnect();
				if ( err ) throw err;
			});
			break;

		case args.length === 1 && args[0] === 'status':
			pm2.list(( err, processDescriptionList ) => {
				pm2.disconnect();
				if ( err ) throw err;
				else if ( typeof processDescriptionList[0] !== 'undefined' ) console.log( `Server is: ${processDescriptionList[0].pm2_env.status} on port: ${processDescriptionList[0].pm2_env.APP_PORT}` );
				else console.log( 'Server not started.' );
			});
			break;

		case args.length === 1 && args[0] === 'edit':
			exec( `${getCommandLine()} ${projectDir}/env.js`, ( err ) => {
				if ( err )
				{
					console.log( 'An error has occurred while trying to edit env file.' );
					console.log( 'Error: ' );
					console.log( e );
					console.log( 'You have to manually edit the file below:' );
					console.log( `${projectDir}/env.js` );

					process.exit( 1 );
				}

				pm2.disconnect();
			});
			break;

		case args.length === 1 && args[0] === '-s':
		case args.length === 1 && args[0] === '--standalone':
		case args.length === 2 && args[0] === 'start' && args[1] === '-s':
		case args.length === 2 && args[0] === 'start' && args[1] === '--standalone':
			pm2.disconnect();
			spawn( 'pm2-runtime', [`${projectDir}/ecosystem.config.js`], { stdio: 'inherit' } );
			break;

		case args.length === 1 && args[0] === 'stop':
			pm2.stop( 'server-emulator', ( err, proc ) => {
				pm2.disconnect();

				if ( err ) throw err;
			});
			break;

		default:
			console.log( 'Available commands:' );
			console.log( 'serve ---> starts the server' );
			console.log( 'serve start ---> starts the server' );
			console.log( 'serve start --standalone[-s] ---> starts the server without the pm2 daemon ( useful for testing errors )' );
			console.log( 'serve status ---> gets the status of the server' );
			console.log( 'serve edit ---> edits the server\'s env variables' );
			console.log( 'serve stop ---> stop the server' );
			pm2.disconnect();
			break;
	}
});
