const fs	= require("fs");
const path	= require("path");

function fromDir( startPath, fileToFind ) {
	if ( ! fs.existsSync( startPath ) ) {
		return null;
	}

	const files	= fs.readdirSync( startPath );

	for( let i = 0; i < files.length; i ++ ) {
		const file	= path.join( startPath, files[i] );
		const stat	= fs.lstatSync( file );

		if ( stat.isDirectory() ) {
			const foundReadStream	= fromDir( file, fileToFind );

			if ( foundReadStream )
				return foundReadStream;
		}
		else if ( file.endsWith( fileToFind ) ) {
			return fs.createReadStream( file );
		}
	}

	return null;
}

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;
const CSS_HEADER	= 'text/css';
const JS_HEADER		= 'application/javascript';
const SVG_HEADER	= 'image/svg+xml';

module.exports	= function ( event, directory ) {
	const readStream	= fromDir( path.join( PROJECT_ROOT, directory ), event.path );

	if ( ! readStream )
		return event.next();

	let mimeType	= '*/*';
	switch ( path.extname( path.join( PROJECT_ROOT, directory, event.path ) ) )
	{
		case '.css':
			mimeType	= CSS_HEADER;
			break;

		case '.js':
			mimeType	= JS_HEADER;
			break;

		case '.svg':
			mimeType	= SVG_HEADER;
			break;

		default:
			break;
	}

	event.setResponseHeader( 'Content-Type', mimeType ).setStatusCode( 200 );

	readStream.pipe( event.response );
}