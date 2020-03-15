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
		this._userPreviewDeleteElement.hide();
		this._userPreviewUsernameElement.hide();
		this._userPreviewUsernameElement.val( '' );
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
		this._userPreviewDeleteElement.show().on( 'click', ()=>{
			users.deleteUser( userData.username ).then( this.hide.bind( this ) ).catch( ( jqXHR )=>{
				this.hide();

				this.show( jqXHR.responseText );
			} );
		});
	}
}