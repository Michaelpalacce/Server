'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class AddUserInput extends Input
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
		return this.get( AddUserInput.USERNAME_KEY );
	}

	/**
	 * @return	mixed
	 */
	getPassword()
	{
		return this.get( AddUserInput.PASSWORD_KEY );
	}

	/**
	 * @return	mixed
	 */
	getRoute()
	{
		return this.get( AddUserInput.ROUTE_KEY );
	}

	/**
	 * @return	mixed
	 */
	getIsSU()
	{
		return this.get( AddUserInput.IS_SU_KEY );
	}

	/**
	 * @brief	Gets the user data in a way to be saved
	 *
	 * @return	Object
	 */
	getUserData()
	{
		return {
			[AddUserInput.ROUTE_KEY]	: this.getRoute(),
			[AddUserInput.USERNAME_KEY]	: this.getUsername(),
			[AddUserInput.PASSWORD_KEY]	: this.getPassword(),
			[AddUserInput.IS_SU_KEY]	: this.getIsSU()
		}
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		if ( ! this.event.session.has( 'SU' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		if ( ! this.event.session.get( 'SU' ) )
		{
			this.reason	= `Only Super Users can add other users`;
			return false;
		}

		this.reason	= this.validationHandler.validate( this.event.body,
			{
				username	: 'filled||string||range:3-64',
				password	: 'filled||string||range:3-64',
				isSU		: 'filled||boolean',
				route		: 'filled||string'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		let { route, username, password, isSU }	= this.reason.getValidationResult();
		route									= Buffer.from( decodeURIComponent( route ), 'base64' ).toString();

		if ( this.userManager.has( username ) )
		{
			this.reason	= `User: ${username} already exists`;
			return false;
		}

		this.model[AddUserInput.ROUTE_KEY]		= route;
		this.model[AddUserInput.USERNAME_KEY]	= username;
		this.model[AddUserInput.PASSWORD_KEY]	= password;
		this.model[AddUserInput.IS_SU_KEY]		= isSU;

		return true;
	}
}

AddUserInput.ROUTE_KEY		= 'route';
AddUserInput.USERNAME_KEY	= 'username';
AddUserInput.PASSWORD_KEY	= 'password';
AddUserInput.IS_SU_KEY		= 'isSU';

module.exports	= AddUserInput;