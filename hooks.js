const os						= require( 'os' );
const path						= require( 'path' );
const { promises, existsSync, readFileSync }	= require( 'fs' );
const { rename }				= promises;
const args						= process.argv.slice( 2 );

const TMP_DIR	= os.tmpdir();
const usersFile	= 'server_emulator_users.json';
const cacheFile	= 'cache';
const envFile	= 'env.js';

function renameIfExists( oldPath, newPath )
{
	return new Promise(( resolve, reject ) => {
		if ( existsSync( oldPath ) )
			rename( oldPath, newPath ).then( resolve ).catch( reject );
		else
			resolve();
	});
}

switch ( true )
{
	case args.length === 1 && args[0] === 'preinstall':
		const promises	= [];

		promises.push( renameIfExists( path.join( __dirname, usersFile ), path.join( TMP_DIR, usersFile ) ) );
		promises.push( renameIfExists( path.join( __dirname, cacheFile ), path.join( TMP_DIR, cacheFile ) ) );
		promises.push( renameIfExists( path.join( __dirname, envFile ), path.join( TMP_DIR, envFile ) ) );

		Promise.all( promises ).then(( results ) => {
			console.log( 'All config files successfully moved TO tmp' )
		}).catch(( e ) => {
			throw e;
		});
		break;
	case args.length === 1 && args[0] === 'postinstall':
		const postPromises	= [];

		postPromises.push( renameIfExists( path.join( TMP_DIR, usersFile ), path.join( __dirname, usersFile ) ) );
		postPromises.push( renameIfExists( path.join( TMP_DIR, cacheFile ), path.join( __dirname, cacheFile ) ) );
		postPromises.push( renameIfExists( path.join( TMP_DIR, envFile ), path.join( __dirname, envFile ) ) );

		Promise.all( postPromises ).then(( results ) => {
			console.log( 'All config files successfully moved FROM tmp' )
		}).catch(( e ) => {
			throw e;
		});
		break;
	default:
		throw Error( 'Wrong command' );
}
