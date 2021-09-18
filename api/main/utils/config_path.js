const os			= require( "os" );
const app			= require( 'event_request' );
const configPath	= `${process.env.SERVER_CONFIG_PATH || os.tmpdir()}`;

app.Loggur.log( `Using: ${configPath} as the configuration path` );

module.exports	= configPath;
