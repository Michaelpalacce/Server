'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteInput extends Input
{
	/**
	 * @brief	Returns the item to be deleted
	 *
	 * @returns	String
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
		this.reason	= this.validationHandler.validate( this.event.query, { item : 'filled||string||min:1' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { item }	= this.reason.getValidationResult();
		item			= decode( item );

		this.model[DeleteInput.ITEM_KEY]	= item;
		return true;
	}
}

DeleteInput.ITEM_KEY	= 'item';

module.exports	= DeleteInput;
