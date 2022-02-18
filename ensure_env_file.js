const fs			= require( 'fs' );
const path			= require( 'path' );
const configPath	= require( './api/main/utils/config_path' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;
const envFile		= path.join( configPath, 'env.js' );

if ( ! fs.existsSync( configPath ) )
	fs.mkdirSync( configPath, { recursive: true } );

if ( ! fs.existsSync( path.join( configPath, 'env.js' ) ) )
	fs.copyFileSync( path.join( PROJECT_ROOT, 'env.js.template' ), envFile );

module.exports	= envFile;


