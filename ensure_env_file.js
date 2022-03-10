const fs			= require( 'fs' );
const path			= require( 'path' );
const configPath	= require( './api/main/utils/config_path' );
const envFile		= path.join( configPath, 'env.js' );

if ( ! fs.existsSync( configPath ) )
	fs.mkdirSync( configPath, { recursive: true } );

if ( ! fs.existsSync( path.join( configPath, 'env.js' ) ) )
	fs.copyFileSync( 'env.js.template', envFile );

module.exports	= envFile;


