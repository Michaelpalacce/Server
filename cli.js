#!/usr/bin/env node
'use strict';

const { fork, exec }	= require( 'child_process' );
const path				= require( 'path' );
const fs				= require( 'fs' );
const os				= require( 'os' );

const args				= process.argv.slice( 2 );
const projectDir		= __dirname;
const envFile			= path.join( projectDir, '.env' );
const ENV_SEPARATOR		= '=';

/**
 * @brief	Sets a new env variable
 *
 * @param	{String} key
 * @param	{String} value
 * @param	{Function} doneCallback
 *
 * @return	void
 */
function setNewEnv( key, value, doneCallback )
{
	const variables	= getEnvs();

	variables[key]	= value;

	const writeStream	= fs.createWriteStream( envFile, { flags: 'w' } )

	console.log( variables );

	for ( const key in variables )
		writeStream.write( `${key}=${variables[key]}${os.EOL}` );

	writeStream.end( doneCallback );
}

/**
 * @brief	Gets all the environment variables
 *
 * @return	Object
 */
function getEnvs()
{
	const lines		= fs.readFileSync( envFile, 'utf-8' ).split( /\r?\n/ );
	const variables	= {};

	for ( const line of lines )
	{
		const parts	= line.split( ENV_SEPARATOR );
		const key	= parts.shift();

		if ( key === '' )
			continue;

		variables[key]	= parts.join( ENV_SEPARATOR ).replace( '\r', '' ).replace( '\n', '' );
	}

	return variables;
}

const lockFile			= 'pid.lock';

switch ( true )
{
	case args.length === 0:
	case args.length === 1 && args[0] === 'start':
		fork( path.join( projectDir, './index' ), { stdio: 'inherit' } );
		break;

	case args.length === 1 && args[0] === 'daemon':
		if ( fs.existsSync( path.join( projectDir, lockFile ) ) )
		{
			const pid	= fs.readFileSync( path.join( projectDir, lockFile ) );
			console.log( `Daemon already started with pid: ${pid}` );
			console.log( `If the process is dead and the file is not deleted, then delete: ${path.join( projectDir, lockFile )} manually` );
			process.exit();
			return;
		}

		const childProcess	= fork( path.join( projectDir, './index' ), { detached: true, stdio: 'ignore' } );
		console.log( `Child Process spawned with PID: ${childProcess.pid}` );
		process.exit();
		break;

	case args.length === 1 && args[0] === 'getEnvPath':
		console.log( envFile );
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
		process.kill( parseInt( fs.readFileSync( path.join( projectDir, lockFile ) ).toString() ) );
		fs.unlinkSync( path.join( projectDir, lockFile ) );
		process.exit();
		break;

	case args.length === 3 && args[0] === 'set':
		setNewEnv( args[1], args[2], () => {
			console.log( 'SET!' );
			process.exit();
		});
		break;

	case args.length === 1 && args[0] === 'getEnv':
	case args.length === 1 && args[0] === 'get':
		console.log( getEnvs() );
		process.exit();
		break;

	case args.length === 1 && args[0] === 'help':
	default:
		console.log( 'Commands:' );
		console.log( 'server-emulator ---> starts the server' );
		console.log( 'server-emulator start ---> starts the server' );
		console.log( 'server-emulator daemon ---> starts the server in a detached deamon mode, returns the PID. If a daemon is running, will output the daemon pid' );
		console.log( 'server-emulator kill  ---> kills the daemon' );
		console.log( 'server-emulator getEnvPath ---> returns the absolute path to the .env file' );
		console.log( 'server-emulator terminal ---> installs terminal dependencies ( currently not working )' );
		console.log( 'server-emulator key ${ENV_KEY} ${ENV_VALUE} ---> Changes .env file values or adds new ones.' );
		console.log( 'server-emulator get ---> Gets all the .env variables' );
		console.log( 'server-emulator getEnv ---> Gets all the .env variables' );
		process.exit();
}