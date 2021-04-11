#!/usr/bin/env node
'use strict';

const pm2				= require( 'pm2' );
const { exec, spawn }	= require( 'child_process' );
const path				= require( 'path' );
const fs				= require( 'fs' );

const args				= process.argv.slice( 2 );

const projectDir		= path.join( __dirname, '.' );
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
		case 'win32':
			return 'start';
		case 'win64':
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
			pm2.start( 'ecosystem.config.js', ( err, apps ) => {
				pm2.disconnect();
				if ( err ) throw err;
			});
			break;

		case args.length === 2 && args[0] === 'edit' && args[1] === 'api':
			exec( `${getCommandLine()} ${projectDir}/env.js`, ( err ) => {
				if ( err ) throw err;

				pm2.disconnect();
			});
			break;

		case args.length === 2 && args[0] === 'edit' && args[1] === 'app':
			exec( `${getCommandLine()} ${projectDir}/.env`, ( err ) => {
				if ( err ) throw err;

				pm2.disconnect();
			});
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
			console.log( 'serve edit ---> edits the server\'s env variables' );
			console.log( 'serve stop ---> stop the server' );
			pm2.disconnect();
			break;
	}
});
