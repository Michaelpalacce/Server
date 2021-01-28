#!/usr/bin/env node
'use strict';

const { fork, exec }	= require( 'child_process' );
const helper			= require( './cli_helper/cli_helper' );

const args				= process.argv.slice( 2 );

if ( ! helper.environment.existsEnvFile() )
	helper.environment.resetEnvFile();

switch ( true )
{
	case args.length === 0:
	case args.length === 1 && args[0] === 'start':
		fork( helper.locator.indexFile, { stdio: 'inherit' } );
		break;

	case args.length === 1 && args[0] === 'getProjectDir':
		console.log( helper.locator.projectDir );
		break;

	case args.length === 2 && args[0] === 'setEnv':
		if ( helper.locator.setNewEnv( args[1] ) )
		{
			helper.environment.resetEnvFile();
			console.log( 'SET' );
			return;
		}

		console.log( 'Location does not exist' );
		break;

	case args.length === 1 && args[0] === 'daemon':
		if ( helper.pid.exists() )
		{
			const pid	= helper.pid.get();
			console.log( `Daemon already started with pid: ${pid}` );
			console.log( `If the process is dead and the file is not deleted, then delete: ${helper.locator.lockFile} manually or call server-emulator deletePid` );
			process.exit();
			return;
		}

		const childProcess	= fork( helper.locator.indexFile, { detached: true, stdio: 'ignore' } );
		console.log( `Child Process spawned with PID: ${childProcess.pid}` );
		process.exit();
		break;

	case args.length === 1 && args[0] === 'getEnvPath':
		console.log( helper.locator.envFile );
		process.exit();
		break;

	case args.length === 1 && args[0] === 'terminal':
		console.log( 'Working, this may take a while. A lot of text will hit you when this is done.' );
		exec( 'npm i -g node-pty@^0.9.0 && npm i -g xterm@^4.4.0 && npm i -g socket.io@^2.3.0', ( err, stdout, stderr ) => {

			if ( err )
				console.log( err );
			if ( stdout )
				console.log( stdout );
			if ( stderr )
				console.log( stderr );

			console.log( 'COMPLETED!' );
			process.exit();
		});
		break;

	case args.length === 1 && args[0] === 'kill':
		process.kill( helper.pid.get());
		helper.pid.delete();

		process.exit();
		break;

	case args.length === 1 && args[0] === 'deletePid':
		helper.pid.delete();
		process.exit();
		break;

	case args.length === 3 && args[0] === 'set':
		helper.environment.setNewEnvVariable( args[1], args[2], () => {
			console.log( 'SET!' );
			process.exit();
		});
		break;

	case args.length === 1 && args[0] === 'resetEnv':
		helper.environment.resetEnvFile();
		break;

	case args.length === 1 && args[0] === 'get':
		console.log( helper.environment.getEnvVariables() );
		process.exit();
		break;

	case args.length === 1 && args[0] === 'help':
	default:
		console.log( 'Commands:' );
		console.log( 'server-emulator ---> starts the server' );
		console.log( 'server-emulator start ---> starts the server' );
		console.log( 'server-emulator daemon ---> starts the server in a detached deamon mode, returns the PID. If a daemon is running, will output the daemon pid' );
		console.log( 'server-emulator kill  ---> kills the daemon' );
		console.log( 'server-emulator getProjectDir ---> returns the absolute path to the project' );
		console.log( 'server-emulator getEnvPath ---> returns the absolute path to the .env file' );
		console.log( 'server-emulator terminal ---> installs terminal dependencies ( currently not working )' );
		console.log( 'server-emulator set ${ENV_KEY} ${ENV_VALUE} ---> Changes .env file values or adds new ones.' );
		console.log( 'server-emulator get ---> Gets all the .env variables' );
		console.log( 'server-emulator resetEnv ---> Resets the .env file to the defaults.' );
		console.log( 'server-emulator setEnv ---> Sets a new location for the .env file and resets it' );
		console.log( 'server-emulator deletePid ---> Deletes the PID file' );
		process.exit();
}