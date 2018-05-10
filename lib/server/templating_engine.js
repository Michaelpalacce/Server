'use strict';

// Dependencies
const fs	= require( 'fs' );
const path	= require( 'path' );

/**
 * @brief	A simple templating engine
 */
class TemplatingEngine
{
	/**
	 * @brief	Renders the given template
	 *
	 * @details	Uses a simple {{ }} to implement simple JS functionality
	 * 			Callback will be called when rendering is finished with an error if any
	 *
	 * @param	String templateName
	 * @param	Object variables
	 * @param	Function callback
	 *
	 * @return	void
	 */
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
				callback( false, TemplatingEngine.parseRenderedTemplate( str, variables ) );
			}
			else
			{
				callback( 'ERROR WHILE RENDERING' );
			}
		});
	}

	/**
	 * @brief	Returns a match
	 *
	 * @param	line
	 * @param	js ! Optional
	 *
	 * @return	String
	 */
	static getMatch( line, js )
	{
		let reExp	= /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
		let code	= '';
		js	? ( code += line.match( reExp ) ? line + '\n' : 'r.push(' + line + ');\n' ) :
			( code += line !== '' ? 'r.push("' + line.replace( /"/g, '\\"' ) + '");\n' : '' );

		return code;
	}

	/**
	 * @see	TemplatingEngine::render();
	 */
	static parseRenderedTemplate( template, variables )
	{
		let re	= /<%([^%>]+)?%>/g, code = 'var r=[];\n', cursor = 0, match;

		while( match = re.exec( template ) )
		{
			code	+= TemplatingEngine.getMatch( template.slice( cursor, match.index ) );
			code	+= TemplatingEngine.getMatch( match[1], true );
			cursor	= match.index + match[0].length;
		}
		code	+= TemplatingEngine.getMatch( template.substr( cursor, template.length - cursor ) );
		code	+= 'return r.join("");';

		let result	= new Function( code.replace( /[\r\t\n]/g, '' ) ).apply( variables );
		return result;
	}
}

// Export the module
module.exports	= TemplatingEngine;