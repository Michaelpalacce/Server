const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class BrowseInput extends Input
{
	/**
	 * @brief	Returns the position of data load
	 *
	 * @returns	mixed
	 */
	getPosition()
	{
		return this.get( BrowseInput.POSITION_KEY );
	}

	/**
	 * @brief	Returns the directory
	 *
	 * @returns	mixed
	 */
	getDir()
	{
		return this.get( BrowseInput.DIR_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		if ( ! this.event.session.has( 'route' ) )
			return false;

		const route		= this.event.session.get( 'route' );
		const result	= this.validationHandler.validate(
			this.event.queryString,
			{
				dir			: { rules: 'optional||string', default: route },
				position	: { rules: 'optional||numeric', default: 0 }
			}
		);

		if ( result.hasValidationFailed() )
			return false;

		const { dir, position }	= result.getValidationResult();

		this.model[BrowseInput.DIR_KEY]			= dir.includes( route ) ? dir : route;
		this.model[BrowseInput.POSITION_KEY]	= parseInt( position );

		return true;
	}
}

BrowseInput.POSITION_KEY	= 'position';
BrowseInput.DIR_KEY			= 'dir';

module.exports	= BrowseInput;