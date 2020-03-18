'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const ejs			= require( 'ejs' );
const path			= require( 'path' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Instantiate the server
 */
const app	= Server();

app.apply( 'er_env' );

// Configure the plugins
require( './handlers/main/bootstrap_plugins' );

app.apply( app.er_static_resources, { paths : [process.env.STATIC_PATH, 'favicon.ico', '/node_modules/xterm/'] } );
app.apply( app.er_body_parser_form );
app.apply( app.er_body_parser_json );
app.apply( app.er_body_parser_multipart, { tempDir : path.join( PROJECT_ROOT, process.env.UPLOADS_DIR ) } );
app.apply( app.er_timeout, { timeout : process.env.REQUEST_TIMEOUT } );
app.apply( app.er_rate_limits );
app.apply( app.er_logger );
app.apply( app.er_cache_server );
app.apply( app.er_response_cache );
app.apply( app.er_file_stream );
app.add(( event )=>{
	event.render	= ( templateName, variables )=>{
		return ejs.renderFile( path.join( process.env.TEMPLATING_DIR, templateName + '.ejs' ), variables )
			.then( data =>{ event.send( data, 200, true ); } );
	};

	event.on( 'cleanUp', ()=>{ event.render	= undefined; });

	event.next();
});
app.apply( app.er_session );

require( './handlers/controllers' );

module.exports	= app;
