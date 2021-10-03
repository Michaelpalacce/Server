const path			= require( 'path' );
const configPath	= require( '../../../main/utils/config_path' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir.trim();
module.exports		= [PROJECT_ROOT, configPath];
