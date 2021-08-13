'use strict';

// Dependencies
const Input	= require( '../../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class NewFavoriteInput extends Input
{
	/**
	 * @brief	Returns the item to be added
	 *
	 * @returns	String
	 */
	getItem()
	{
		return this.get( NewFavoriteInput.ITEM_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.body,
			{
				item: {
					name				: 'string',
					isFolder			: 'boolean',
					fileType			: 'string',
					previewAvailable	: 'boolean',
					encodedURI			: 'string',
					size				: 'numeric'
				}
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		let { item }	= this.reason.getValidationResult();

		this.model[NewFavoriteInput.ITEM_KEY]	= item;
		return true;
	}
}

NewFavoriteInput.ITEM_KEY	= 'item';

module.exports	= NewFavoriteInput;
