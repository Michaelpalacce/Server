
const fs	= require( 'fs' );
const path	= require( 'path' );

class TemplatingEngine
{
	constructor()
	{
		this.literalReplace	= /{{\s*(STRING_ID)\s*}}/;
	}

	render( templateName, variables, callback )
	{
		templateName	= typeof templateName === 'string' && templateName.length > 0 ? templateName : false;

		if ( ! templateName )
		{
			callback( 'ERROR WHILE RENDERING' );
		}

		let templatesDirectory	= path.join( __dirname, '/../../templates/' );
		fs.readFile( templatesDirectory + templateName + '.html', 'utf8', ( err, str ) => {
			if ( ! err && str && str.length > 0 )
			{
				callback( TemplatingEngine.parseRenderedTemplate( str, variables ) );
			}
			else
			{
				callback( 'ERROR WHILE RENDERING' );
			}
		});
	}

	static addMatch( line, js )
	{
		let reExp	= /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g
		let code	= '';
		js	? ( code += line.match( reExp ) ? line + '\n' : 'r.push(' + line + ');\n' ) :
			( code += line !== '' ? 'r.push("' + line.replace( /"/g, '\\"' ) + '");\n' : '' );

		return code;
	}

	static parseRenderedTemplate( template, variables )
	{
		let re	= /{{([^%>]+)?}}/g, code = 'var r=[];\n', cursor = 0, match;

		while( match = re.exec( template ) )
		{
			code	+= TemplatingEngine.addMatch( template.slice( cursor, match.index ) );
			code	+= TemplatingEngine.addMatch( match[1], true );
			cursor	= match.index + match[0].length;
		}
		code	+= TemplatingEngine.addMatch( template.substr( cursor, template.length - cursor ) );
		code	+= 'return r.join("");';

		let result	= new Function( code.replace( /[\r\t\n]/g, '' ) ).apply( variables );
		return result;
	}
}

module.exports	= TemplatingEngine;