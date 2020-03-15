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
		$( document ).on( 'click', '#addUser', async ( event )=>{
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();

			const username		= await modal.askUserInput( 'What is the user\'s username?' ).catch( this.showError );
			const password		= await modal.askUserInput( 'What is the user\'s password?' ).catch( this.showError );
			const route			= encodeURIComponent( await modal.askUserInput( 'What is the user\'s allowed route?', '/' ).catch( this.showError ) );
			const isSU			= await modal.askConfirmation( 'Is the user a super user' ).catch( this.showError );
			const permissions	= [];

			const userParams	= {
				username,
				password,
				route,
				isSU,
				permissions
			};

			$.ajax({
				url		: '/users/add',
				method	: 'POST',
				data	: userParams,
				success	: ()=>{
					this.showUser( username );
				},
				error	: this.showError
			});

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
		this.fetchUserData( username ).then( ( userData )=>{
			modal.showUserInfo( userData );
		}).catch( this.showError );
	}

	/**
	 * @brief	Fetches data about the user
	 *
	 * @param	username String
	 *
	 * @return	Promise
	 */
	fetchUserData( username )
	{
		return new Promise(( resolve, reject )=>{
			$.ajax({
				url		: `/users/${username}`,
				method	: 'GET',
				success	: ( userData )=>{
					resolve( JSON.parse( userData ) );
				},
				error	: reject
			});
		});
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
			success	: ( usersString )=>{
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

		element.on( 'click', ()=>{
			this.showUserModal( username );
		});

		element.show();
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
		return new Promise(( resolve, reject )=>{
			$.ajax({
				url		: `/users/${username}`,
				method	: 'DELETE',
				success	: ( response )=>{
					$( `*[data-username="${username}"]` ).remove();
					resolve( response );
				},
				error	: reject
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
		modal.show( jqXHR.responseText );
	}
}

const users	= new Users();
const modal	= new UsersModal();
