/**
 * @brief	Class responsible for the Users view
 */
class Users
{
	loadUsers()
	{
		$.ajax({
			url		: '/users/list',
			method	: 'GET',
			success	: ( usersString )=>{
				const users	= JSON.parse( usersString );

				for ( const username of users )
				{
					this.addUser( username );
				}
			},
			error	: this.showError.bind( this )
		})
	}

	/**
	 * @brief	Adds a new user to the view
	 *
	 * @param	username String
	 *
	 * @return	void
	 */
	addUser( username )
	{
		const element	= $( '#userRow' ).clone().removeAttr( 'id' );

		element.find( '.userRowName' ).text( username );

		element.appendTo( '#userStructure' );

		element.show();
	}

	/**
	 * @brief	Shows an error to the user
	 *
	 * @param	jqXHR jqXHR
	 *
	 * @return	void
	 */
	showError( jqXHR )
	{
		modal.show( jqXHR.responseText );
	}
}

const users	= new Users();

users.loadUsers();