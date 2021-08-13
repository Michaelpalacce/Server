'use strict';

// Dependencies
const Input	= require( '../../../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteFavoriteInput extends Input
{
	/**
	 * @brief	Returns the id to be deleted
	 *
	 * @returns	String
	 */
	getId()
	{
		return this.get( DeleteFavoriteInput.ID_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate( this.event.params,
			{
				id: 'string||range:31-33'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		let { id }	= this.reason.getValidationResult();

		this.model[DeleteFavoriteInput.ID_KEY]	= id;
		return true;
	}
}

DeleteFavoriteInput.ID_KEY	= 'id';

module.exports	= DeleteFavoriteInput;
