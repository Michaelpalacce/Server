/**
 * @brief	Class responsible for showing the modal and hiding it
 */
class Modal
{
	constructor()
	{
		this._element				= $( '#modal' );
		this._contentElement		= $( '#modal-content' );
		this._textElement			= this._element.find( '#modalText' );

		this._choiceRowElement		= this._element.find( '#modalChoiceRow' ).hide();
		this._choiceYesElement		= this._element.find( '#modalchoiceYes' ).hide();
		this._choiceNoElement		= this._element.find( '#modalchoiceNo' ).hide();

		this._inputRowElement		= this._element.find( '#modalInputRow' ).hide();
		this._inputElement			= this._element.find( '#modalInput' ).hide();
		this._submitElement			= this._element.find( '#modalSubmit' ).hide();

		this._previewElement		= this._element.find( '#modalPreview' ).hide();
		this._previewVideoElement	= this._element.find( '#modalPreviewVideo' ).hide();
		this._previewAudioElement	= this._element.find( '#modalPreviewAudio' ).hide();
		this._previewTextElement	= this._element.find( '#modalPreviewText' ).hide();
		this._previewImageElement	= this._element.find( '#modalPreviewImage' ).hide();
	}

	/**
	 * @brief	Show a preview of a file
	 *
	 * @param	type String
	 * @param	encodedURI String
	 *
	 * @return	void
	 */
	showPreview( type, encodedURI )
	{
		const dataSrc	= `/file/data?file=${encodedURI}`;
		this._contentElement.addClass( 'bigger-modal-content' );
		switch ( type )
		{
			case 'video':
				this._previewVideoElement.show();
				this._previewVideoElement.attr( 'src', dataSrc );
				break;
			case 'audio':
				this._previewAudioElement.show();
				this._previewAudioElement.attr( 'src', dataSrc );
				break;
			case 'text':
				this._previewTextElement.show();
				$.ajax({
					url			: dataSrc,
					method		: 'GET',
					dataType	: 'text',
					success		: ( result )=>{
						result	= result.replace( / /g, '&nbsp;' );
						result	= result.replace( /\t/g, '&emsp;' );
						result	= result.replace( /\n/g, '<br>' );

						this._previewTextElement.append( result );
					}
				});

				break;
			case 'image':
				this._previewImageElement.show();
				this._previewImageElement.attr( 'src', dataSrc );
				break;
			default:
				this.show( `Invalid file type ${type}` );
				return;
		}

		this._previewElement.show();
		this.show( '' );
	}

	/**
	 * @brief	Asks the user for input
	 *
	 * @param	text String
	 * @param	defaultInput String
	 *
	 * @return	Promise
	 */
	askUserInput( text = '', defaultInput = '' )
	{
		this.show( text );

		return new Promise(( resolve, reject )=>{
			let resolved	= false;

			this._inputElement.show();
			this._submitElement.show();
			this._inputRowElement.show();

			this._inputElement.val( defaultInput );

			const getDataCallback	= ( event )=>{
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				if ( resolved )
				{
					return;
				}

				resolved	= true;

				resolve( this._inputElement.val() );
				this.hide();
			};

			this._inputElement.one( 'submit', getDataCallback.bind( this ) );
			this._submitElement.one( 'click', getDataCallback.bind( this ) );
			$( document ).on( 'keyup', ( e ) => {
				if ( e.which === 13 )
				{
					getDataCallback( e );
				}
			});

			this._inputElement.focus();
		})
	}

	/**
	 * @brief	Asks the user for input
	 *
	 * @param	text String
	 *
	 * @return	Promise
	 */
	askConfirmation( text = '' )
	{
		this.show( text );

		return new Promise(( resolve, reject )=>{
			let resolved	= false;

			this._choiceRowElement.show();
			this._choiceYesElement.show();
			this._choiceNoElement.show();

			const getChoiceCallback	= ( event, choice )=>{
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				if ( resolved )
				{
					return;
				}

				resolved	= true;

				resolve( choice );
				this.hide();
			};

			this._choiceYesElement.on( 'click', ( event )=>{
				getChoiceCallback( event, true );
			});

			this._choiceNoElement.on( 'click', ( event )=>{
				getChoiceCallback( event, false );
			});

			this._choiceYesElement.focus();
		})
	}

	/**
	 * @brief	Attaches events for the modal
	 *
	 * @return	void
	 */
	attachEvents()
	{
		$( document ).on( 'keyup', ( e ) => {
			if ( e.key === 'Escape' )
			{
				this.hide();
			}
		});

		this._element.on( 'click', ( event )=>{
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();

			if ( ! event.target.closest( '.modal-content' ) )
			{
				this.hide();
			}
		});
	}

	/**
	 * @brief	Detaches events for the modal
	 *
	 * @return	void
	 */
	detachEvents()
	{
		$( document ).off( 'keyup' );
		this._submitElement.off( 'click' );
		this._element.off( 'click' );
		this._choiceYesElement.off( 'click' );
		this._choiceNoElement.off( 'click' );
	}

	/**
	 * @brief	Show the modal
	 *
	 * @details	The text provided will be shown in the modal
	 * 			An Esc press event will be added for closing the modal
	 * 			If asHtml is true, the text will be parsed
	 *
	 * @param	text String
	 * @param	asHtml Boolean
	 *
	 * @return	void
	 */
	show( text = '', asHtml = false )
	{
		this._element.show();
		if ( asHtml )
		{
			this._textElement.html( text );
		}
		else
		{
			this._textElement.text( text );
		}

		this.attachEvents();
	}

	/**
	 * @brief	Hides the modal
	 *
	 * @details	This will revert the text back to empty and remove the event
	 *
	 * @return	void
	 */
	hide()
	{
		this._element.hide();
		this._submitElement.hide();
		this._inputElement.hide();
		this._inputRowElement.hide();
		this._choiceRowElement.hide();
		this._choiceYesElement.hide();
		this._choiceNoElement.hide();
		this._previewElement.hide();
		this._previewVideoElement.hide();
		this._previewAudioElement.hide();
		this._previewTextElement.hide();
		this._previewImageElement.hide();
		this._contentElement.removeClass( 'bigger-modal-content' );
		this._previewVideoElement.trigger( 'pause' );
		this._previewAudioElement.trigger( 'pause' );

		this._previewTextElement.text( '' );
		this._textElement.text( '' );
		this._inputElement.val( '' );
		this.detachEvents();
	}
}

let modal		= new Modal();
