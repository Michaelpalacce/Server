/**
 * @brief	Class responsible for the Users view
 */
class Users
{
	constructor()
	{
		this.loadAllUsers();
		this.attachEvents();
	}

	/**
	 * @brief
	 */
	attachEvents()
	{
		$( document ).on( 'click', '#addUser', async ( event ) => {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();

			const username	= await modal.askUserInput( 'What is the user\'s username?' ).catch( this.hideModal );
			const password	= await modal.askUserInput( 'What is the user\'s password?' ).catch( this.hideModal );
			const route		= encodeURIComponent(
				btoa(
					await modal.askUserInput( 'What is the user\'s allowed route?', '/' ).catch( this.hideModal )
				)
			);
			const isSU		= await modal.askConfirmation( 'Is the user a super user' ).catch( this.hideModal );
			let permissions	= {};

			if ( await modal.askConfirmation( 'Do you want to add route permissions?' ).catch( this.hideModal ) )
			{
				do
				{
					const route	= await modal.askUserInput( 'Route to deny:' ).catch( this.hideModal );

					let method	= await modal.askUserInput( 'Route method to deny:' ).catch( this.hideModal );
					try{ method	= JSON.parse( method ); } catch ( e ) {}

					permissions[route]	= method;
				}
				while ( await modal.askConfirmation( 'Do you want to add more?' ) );
			}

			permissions	= encodeURIComponent( btoa( JSON.stringify( permissions ) ) );

			const userParams	= {
				username,
				password,
				route,
				isSU,
				permissions
			};

			this.addUser( userParams );

			return false;
		});
	}

	/**
	 * @brief	Shows the user modal with information about the user
	 *
	 * @param	String username
	 *
	 * @return	void
	 */
	showUserModal( username )
	{
		this.getUser( username ).then( ( userData ) => {
			modal.showUserInfo( userData );
		}).catch( this.showError );
	}

	/**
	 * @brief	Loads all the users from the DB
	 *
	 * @return	void
	 */
	loadAllUsers()
	{
		$.ajax({
			url		: '/users/list',
			method	: 'GET',
			success	: ( usersString ) => {
				const users	= JSON.parse( usersString );

				for ( const username of users )
				{
					this.showUser( username );
				}
			},
			error	: this.showError
		});
	}

	/**
	 * @brief	Adds a new user to the view
	 *
	 * @param	username String
	 *
	 * @return	void
	 */
	showUser( username )
	{
		const element	= $( '#userRow' ).clone().removeAttr( 'id' ).attr( 'data-username', username );

		element.find( '.userRowName' ).text( username );

		element.appendTo( '#userStructure' );

		element.on( 'click', () => {
			this.showUserModal( username );
		});

		element.show();
	}

	/**
	 * @brief	Adds a new user
	 *
	 * @param	userParams Object
	 *
	 * @return	Promise
	 */
	addUser( userParams )
	{
		return new Promise(( resolve, reject ) => {
			$.ajax({
				url		: '/users/add',
				method	: 'POST',
				data	: userParams,
				success	: () => {
					this.showUser( userParams.username );

					resolve();
				},
				error	: this.showError
			});
		});
	}

	/**
	 * @brief	Gets the user
	 *
	 * @param	username String
	 *
	 * @return	Promise
	 */
	getUser( username )
	{
		return new Promise(( resolve, reject ) => {
			$.ajax({
				url		: `/users/${username}`,
				method	: 'GET',
				success	: ( userData ) => {
					resolve( JSON.parse( userData ) );
				},
				error	: this.showError
			});
		});
	}

	/**
	 * @brief	Deletes the given user
	 *
	 * @param	username String
	 *
	 * @return	void
	 */
	deleteUser( username )
	{
		return new Promise(( resolve, reject ) => {
			$.ajax({
				url		: `/users/${username}`,
				method	: 'DELETE',
				success	: ( response ) => {
					$( `*[data-username="${username}"]` ).remove();
					resolve( response );
				},
				error	: this.showError
			});
		});
	}

	/**
	 * @brief	Updates the user with the given information
	 *
	 * @param	username String
	 * @param	userData Object
	 *
	 * @return	Promise
	 */
	updateUser( username, userData )
	{
		return new Promise(( resolve, reject ) => {
			$.ajax({
				url		: `/users/${username}`,
				method	: 'PATCH',
				data	: userData,
				success	: resolve,
				error	: this.showError
			});
		});
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
		modal.hide();

		modal.show( jqXHR.responseText );
	}

	/**
	 * @brief	Hides the modal
	 *
	 * @return	void
	 */
	hideModal()
	{
		modal.hide();
	}
}

const users	= new Users();
