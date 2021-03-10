'use strict';

// Dependencies
const Input	= require( '../../main/validation/input' );

/**
 * @brief	Validates that the provided request contains the correct data
 */
class UpdateUserInput extends Input
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
		return this.get( UpdateUserInput.USERNAME_KEY );
	}

	/**
	 * @return	mixed
	 */
	getPassword()
	{
		return this.get( UpdateUserInput.PASSWORD_KEY );
	}

	/**
	 * @return	mixed
	 */
	getRoute()
	{
		return this.get( UpdateUserInput.ROUTE_KEY );
	}

	/**
	 * @return	mixed
	 */
	getPermissions()
	{
		return this.get( UpdateUserInput.PERMISSIONS_KEY );
	}

	/**
	 * @brief	Gets the user data in a way to be saved
	 *
	 * @return	Object
	 */
	getUserData()
	{
		return {
			[UpdateUserInput.ROUTE_KEY]			: this.getRoute(),
			[UpdateUserInput.PASSWORD_KEY]		: this.getPassword(),
			[UpdateUserInput.PERMISSIONS_KEY]	: this.getPermissions(),
		};
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
			this.reason	= `Only Super Users can add update users`;
			return false;
		}

		this.reason	= this.validationHandler.validate( this.event.params, { username : 'filled||string||range:3-64' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		const { username }	= this.reason.getValidationResult();

		this.reason	= this.validationHandler.validate( this.event.body,
			{
				password	: 'filled||string||range:3-64',
				permissions	: 'filled||string',
				isSU		: 'filled||boolean',
				route		: 'filled||string'
			}
		);

		if ( this.reason.hasValidationFailed() )
			return false;

		let { route, password, isSU, permissions }	= this.reason.getValidationResult();
		route										= Buffer.from( decodeURIComponent( route ), 'base64' ).toString();

		try
		{
			permissions	= JSON.parse( Buffer.from( decodeURIComponent( permissions ), 'base64' ).toString() );
		}
		catch ( e )
		{
			this.reason	= `User permissions must be a valid JSON`;
			return false;
		}

		if ( ! this.userManager.has( username ) )
		{
			this.reason	= `User: ${username} does not exists`;
			return false;
		}

		this.model[UpdateUserInput.ROUTE_KEY]		= route;
		this.model[UpdateUserInput.USERNAME_KEY]	= username;
		this.model[UpdateUserInput.PASSWORD_KEY]	= password;
		this.model[UpdateUserInput.IS_SU_KEY]		= isSU;
		this.model[UpdateUserInput.PERMISSIONS_KEY]	= permissions;

		return true;
	}
}

UpdateUserInput.ROUTE_KEY		= 'route';
UpdateUserInput.USERNAME_KEY	= 'username';
UpdateUserInput.PASSWORD_KEY	= 'password';
UpdateUserInput.IS_SU_KEY		= 'isSU';
UpdateUserInput.PERMISSIONS_KEY	= 'permissions';

module.exports	= UpdateUserInput;