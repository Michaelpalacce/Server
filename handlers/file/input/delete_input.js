'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteInput extends Input
{
	/**
	 * @brief	Returns the item to be deleted
	 *
	 * @returns	mixed
	 */
	getItem()
	{
		return this.get( DeleteInput.ITEM_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.queryString, { item : 'filled||string' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { item }						= this.reason.getValidationResult();
		this.model[DeleteInput.ITEM_KEY]	= item;

		return true;
	}
}

DeleteInput.ITEM_KEY	= 'item';

module.exports	= DeleteInput;