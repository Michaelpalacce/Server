'use strict';

// Dependencies
const Input			= require( '../../../../main/validation/input' );
const { decode }	= require( '../../../../main/utils/base_64_encoder' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class MoveInput extends Input
{
	/**
	 * @brief	Returns the new path
	 *
	 * @returns	String
	 */
	getNewPath()
	{
		return this.get( MoveInput.NEW_PATH_KEY );
	}

	/**
	 * @brief	Returns the old path
	 *
	 * @returns	String
	 */
	getOldPath()
	{
		return this.get( MoveInput.OLD_PATH_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		this.reason	= this.validationHandler.validate(
			this.event.body,
			{
				newPath: 'filled||string',
				oldPath: 'filled||string'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		const { newPath, oldPath }			= this.reason.getValidationResult();
		this.model[MoveInput.NEW_PATH_KEY]	= decode( newPath );
		this.model[MoveInput.OLD_PATH_KEY]	= decode( oldPath );

		return true;
	}
}

MoveInput.NEW_PATH_KEY	= 'newPath';
MoveInput.OLD_PATH_KEY	= 'oldPath';

module.exports	= MoveInput;