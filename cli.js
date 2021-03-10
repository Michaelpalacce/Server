#!/usr/bin/env node
'use strict';

const pm2				= require( 'pm2' );
const { exec, spawn }	= require( 'child_process' );
const path				= require( 'path' );
const fs				= require( 'fs' );

const args				= process.argv.slice( 2 );

const NODE_ENV			= process.env.NODE_ENV;
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

switch ( true )
{
	case args.length === 0:
		pm2.connect(( err ) => {
			if ( err )
			{
				console.error( err );
				process.exit( 2 );
			}

			if ( NODE_ENV === 'dev' )
			{
				spawn( 'pm2-runtime', ['dev.ecosystem.config.js'], { stdio: 'inherit' } );
			}
			else
				pm2.start( 'ecosystem.config.js', console.log );
		});
		break;

	case args.length === 1 && args[0] === 'edit':
		exec( `${getCommandLine()} ${projectDir}/.env.js`);
		break;
}
