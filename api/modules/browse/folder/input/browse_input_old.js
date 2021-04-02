'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const path			= require( 'path' );
const os			= require( 'os' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Validates that the provided request contains the correct data
 */
class BrowseInput extends Input
{
	/**
	 * @return	String
	 */
	getToken()
	{
		return this.get( BrowseInput.TOKEN_KEY );
	}

	/**
	 * @return	String
	 */
	getDirectory()
	{
		return this.get( BrowseInput.DIRECTORY_KEY );
	}

	/**
	 * @return	String
	 */
	getEncodedDirectory()
	{
		return encodeURIComponent( Buffer.from( this.get( BrowseInput.DIRECTORY_KEY ) ).toString( 'base64' ) );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		const isSU		= this.event.session.get( 'SU' );
		const route		= this.event.session.get( 'route' );
		const result	= this.validationHandler.validate(
			this.event.query,
			{
				dir		: { $rules: 'optional||string', $default: encodeURIComponent( Buffer.from( route ).toString( 'base64' ) ) },
				token	: { $rules: 'optional||string', $default: '' }
			}
		);

		if ( result.hasValidationFailed() )
			return false;

		let { dir, token }	= result.getValidationResult();
		dir					= Buffer.from( decodeURIComponent( dir ), 'base64' ).toString();
		token				= Buffer.from( decodeURIComponent( token ), 'base64' ).toString();
		const resolvedDir	= path.resolve( dir );

		if ( ! isSU && resolvedDir.includes( PROJECT_ROOT ) )
		{
			this.reason	= `You don\'t have permissions to access: ${resolvedDir}`;
			return false;
		}

		if ( ! isSU && resolvedDir.includes( os.tmpdir() ) )
		{
			this.reason	= `You don\'t have permissions to access: ${resolvedDir}`;
			return false;
		}

		if ( ! dir.includes( route ) )
		{
			this.reason	= `You don\\'t have permissions to access: ${resolvedDir}`;
			return false;
		}

		this.model[BrowseInput.DIRECTORY_KEY]		= dir;
		this.model[BrowseInput.TOKEN_KEY]	= token;

		return true;
	}
}

BrowseInput.TOKEN_KEY	= 'token';
BrowseInput.DIRECTORY_KEY		= 'dir';

module.exports	= BrowseInput;