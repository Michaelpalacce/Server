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
	 * @return	mixed
	 */
	getPermissions()
	{
		return this.get( AddUserInput.PERMISSIONS_KEY );
	}

	/**
	 * @brief	Gets the user data in a way to be saved
	 *
	 * @return	Object
	 */
	getUserData()
	{
		return {
			[AddUserInput.ROUTE_KEY]		: this.getRoute(),
			[AddUserInput.USERNAME_KEY]		: this.getUsername(),
			[AddUserInput.PASSWORD_KEY]		: this.getPassword(),
			[AddUserInput.IS_SU_KEY]		: this.getIsSU(),
			[AddUserInput.PERMISSIONS_KEY]	: this.getPermissions()
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

		let { route, username, password, isSU, permissions }	= this.event.body;
		route													= Buffer.from( decodeURIComponent( route ), 'base64' ).toString();
		try
		{
			permissions	= JSON.parse( Buffer.from( decodeURIComponent( permissions ), 'base64' ).toString() );
		}
		catch ( e )
		{
			this.reason	= `User permissions must be a valid JSON`;
			return false;
		}

		if ( this.userManager.has( username ) )
		{
			this.reason	= `User: ${username} already exists`;
			return false;
		}

		this.model[AddUserInput.ROUTE_KEY]			= route;
		this.model[AddUserInput.USERNAME_KEY]		= username;
		this.model[AddUserInput.PASSWORD_KEY]		= password;
		this.model[AddUserInput.IS_SU_KEY]			= isSU;
		this.model[AddUserInput.PERMISSIONS_KEY]	= permissions;

		return true;
	}
}

AddUserInput.ROUTE_KEY			= 'route';
AddUserInput.USERNAME_KEY		= 'username';
AddUserInput.PASSWORD_KEY		= 'password';
AddUserInput.IS_SU_KEY			= 'isSU';
AddUserInput.PERMISSIONS_KEY	= 'permissions';

module.exports	= AddUserInput;