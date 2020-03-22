'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class GetUserInput extends Input
{
	constructor( event, userManager )
	{
		super( event );
		this.userManager	= userManager;
	}

	/**
	 * @return	mixed
	 */
	getUsername()
	{
		return this.get( GetUserInput.USERNAME_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		if ( ! this.event.session.has( 'SU' ) || ! this.event.session.has( 'username' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		this.reason	= this.validationHandler.validate( this.event.params, { username : 'filled||string||range:3-64' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { username }	= this.reason.getValidationResult();

		if ( ! this.event.session.get( 'SU' ) && this.event.session.get( 'username' ) !== username )
		{
			this.reason	= `Only Super Users can view other users`;
			return false;
		}

		if ( ! this.userManager.has( username ) )
		{
			this.reason	= `User: ${username} does not exists`;
			return false;
		}

		this.model[GetUserInput.USERNAME_KEY]	= username;

		return true;
	}
}

GetUserInput.USERNAME_KEY	= 'username';

module.exports	= GetUserInput;