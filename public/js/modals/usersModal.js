/**
 * @brief	Extracts the base modal and adds user functionality
 */
class UsersModal extends Modal
{
	constructor()
	{
		super();

		this._userPreviewElement			= $( '#userPreview' ).hide();
		this._userPreviewDeleteElement		= $( '#userPreviewDelete' ).hide();
		this._userPreviewUsernameElement	= $( '#userPreviewUsername' ).hide();
		this._userPreviewPasswordElement	= $( '#userPreviewPassword' ).hide();
		this._userPreviewRouteElement		= $( '#userPreviewRoute' ).hide();
		this._userPreviewIsSUElement		= $( '#userPreviewIsSU' ).hide();
		this._userPreviewPermissionsElement	= $( '#userPreviewPermissions' ).hide();
		this._userPreviewSaveElement		= $( '#userPreviewSave' ).hide();
	}

	/**
	 * @brief	Hides the modal
	 *
	 * @return	void
	 */
	hide()
	{
		super.hide();

		this._userPreviewElement.hide();
		this._userPreviewPasswordElement.hide();
		this._userPreviewRouteElement.hide();
		this._userPreviewIsSUElement.hide();
		this._userPreviewPermissionsElement.hide();
		this._userPreviewDeleteElement.hide();
		this._userPreviewUsernameElement.hide();
		this._userPreviewSaveElement.hide();
		this._userPreviewUsernameElement.val( '' );
		this._userPreviewPasswordElement.val( '' );
		this._userPreviewRouteElement.val( '' );
		this._userPreviewPermissionsElement.val( '' );
		this._userPreviewIsSUElement.val( '' );
	}

	/**
	 * @brief	Detaches any events that might have been attached
	 *
	 * @return	void
	 */
	detachEvents()
	{
		super.detachEvents();

		this._userPreviewDeleteElement.off( 'click' );
		this._userPreviewSaveElement.off( 'click' );
	}

	/**
	 * @brief	Displays the information for the given user
	 *
	 * @param	userData Object
	 *
	 * @return	void
	 */
	showUserInfo( userData = {} )
	{
		this.show();
		this._userPreviewElement.show();
		this._userPreviewUsernameElement.val( userData.username ).show();
		this._userPreviewPasswordElement.val( userData.password ).show();
		this._userPreviewRouteElement.val( userData.route ).show();
		this._userPreviewPermissionsElement.val( JSON.stringify( userData.permissions ) ).show();
		this._userPreviewIsSUElement.val( userData.isSU ).show();

		this._userPreviewDeleteElement.show().on( 'click', () => {
			users.deleteUser( userData.username ).then( this.hide.bind( this ) ).catch( () => {
				this.hide();
				this.show( `Could not delete ${userData.username}` );
			} );
		});

		this._userPreviewSaveElement.show().on( 'click', () => {
			const username	= this._userPreviewUsernameElement.val();
			const userData	= {
				password	: this._userPreviewPasswordElement.val(),
				route		: encodeURIComponent( btoa( this._userPreviewRouteElement.val() ) ),
				permissions	: encodeURIComponent( btoa( this._userPreviewPermissionsElement.val() ) ),
				isSU		: this._userPreviewIsSUElement.val() === 'true' || this._userPreviewIsSUElement.val() === true
			};

			users.updateUser( username, userData ).then(() => {
				this.hide();
				this.show( `User ${username} has been updated successfully!` );
			}).catch(() => {
				this.hide();
				this.show( `Could not update ${username}` );
			});
		});
	}
}

modal	= new UsersModal();
