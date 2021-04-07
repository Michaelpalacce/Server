'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DownloadInput extends Input
{
	/**
	 * @brief	Returns all the items
	 *
	 * @returns	Array
	 */
	getItems()
	{
		return this.get( DownloadInput.ITEMS_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.query, { items : 'filled||string||min:1' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { items }						= this.reason.getValidationResult();
		this.model[DownloadInput.ITEMS_KEY]	= JSON.parse( decode( items ) );

		return true;
	}
}

DownloadInput.ITEMS_KEY	= 'items';

module.exports	= DownloadInput;