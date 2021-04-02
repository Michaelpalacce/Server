'use strict';

// Dependencies
const Input					= require( '../../../../main/validation/input' );
const { encode, decode }	= require( '../../../../main/utils/base_64_encoder' );

const DEFAULT_ENCODED_DIR	= encode( '/' );

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
		return encode( this.get( BrowseInput.DIRECTORY_KEY ) );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		const result	= this.validationHandler.validate(
			this.event.query,
			{
				directory	: { $rules: 'optional||string', $default: DEFAULT_ENCODED_DIR },
				token		: { $rules: 'optional||string', $default: '' }
			}
		);

		if ( result.hasValidationFailed() )
			return false;

		const { directory, token }				= result.getValidationResult();

		this.model[BrowseInput.DIRECTORY_KEY]	= decode( directory );
		this.model[BrowseInput.TOKEN_KEY]		= decode( token );

		return true;
	}
}

BrowseInput.TOKEN_KEY		= 'token';
BrowseInput.DIRECTORY_KEY	= 'directory';

module.exports			= BrowseInput;