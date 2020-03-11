'use strict';

const ACTION_NONE	= 0;
const ACTION_COPY	= 1;
const ACTION_CUT	= 2;

/**
 * @brief	Class responsible for showing the context menu dialog on right click
 */
class ContextMenu
{
	constructor( view )
	{
		this.view				= view;
		this.document			= $( document );
		this.element			= $( '#contextmenu' );
		this.deleteElement		= this.element.find( '#context-delete' );
		this.downloadElement	= this.element.find( '#context-download' );
		this.cutElement			= this.element.find( '#context-cut' );
		this.copyElement		= this.element.find( '#context-copy' );
		this.pasteElement		= this.element.find( '#context-paste' );
		this.renameElement		= this.element.find( '#context-rename' );

		this.elementWidth		= this.element.width();
		this.elementHeight		= this.element.height();
		this.offset				= 10;

		this.action				= ACTION_NONE;
		this.actionElementPath	= '';

		this.attachEvents();
	}

	/**
	 * @brief	Returns whether the context menu should be shown or not
	 *
	 * @param	Event event
	 *
	 * @returns	Boolean
	 */
	shouldShowBox( event )
	{
		const item	= this.getItemElement( event );

		return ! item.hasClass( 'backFolderElement' ) && ! item.hasClass( 'addFolderElement' );
	}

	/**
	 * @brief	Retrieves the element that was right clicked
	 *
	 * @param	Event event
	 *
	 * @returns	jQueryElement
	 */
	getItemElement( event )
	{
		return $( event.target.closest( '.item' ) );
	}

	/**
	 * @brief	Hides the context Menu
	 *
	 * @return	void
	 */
	closeContextMenu()
	{
		this.element.hide();

		this.deleteElement.off( 'click' );
		this.downloadElement.off( 'click' );
		this.cutElement.off( 'click' );
		this.copyElement.off( 'click' );
		this.pasteElement.off( 'click' );
		this.renameElement.off( 'click' );
	}

	flushActionElementData()
	{
		this.action				= ACTION_NONE;
		this.actionElementPath	= '';
	}

	/**
	 * @brief	Shows the context menu given the event
	 *
	 * @param	Event event
	 *
	 * @return	void
	 */
	showContextMenu( event )
	{
		const target	= this.getItemElement( event );
		this.element.css( this.calculateOffset( event ) ).show();

		switch ( true )
		{
			case target.hasClass( 'folder' ):
				this.downloadElement.hide();
				this.cutElement.hide();
				this.copyElement.hide();
				this.renameElement.hide();
				break;

			case target.hasClass( 'file' ):
				const targetDownloadLink	= target.find( '.file-download' ).attr( 'href' );
				this.downloadElement.show().attr( 'href', targetDownloadLink );

				this.cutElement.on( 'click', ( event )=>{
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					this.action				= ACTION_CUT;
					this.actionElementPath	= this.getElementPath( target );
					this.element.hide();
				} ).show();

				this.copyElement.on( 'click', ( event )=>{
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					this.action				= ACTION_COPY;
					this.actionElementPath	= this.getElementPath( target );
					this.element.hide();
				} ).show();

				this.renameElement.on( 'click', ( event )=>{
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					const newName	= prompt( 'What is the new name of the file' );

					$.ajax({
						url		: '/file/rename',
						method	:'POST',
						data	: {
							newPath: this.view.currentDir + encodeURIComponent( '/' + newName ),
							oldPath: this.getElementPath( target )
						},
						success	: ( data )=>
						{
							target.remove();
							this.view.fetchDataForFileAndAddItem( encodeURIComponent( JSON.parse( data ).newPath ) );
							this.flushActionElementData();
						}
					});

					this.element.hide();
				} ).show();
				break;

			default:
				this.downloadElement.hide();
				this.deleteElement.hide();
				this.cutElement.hide();
				this.copyElement.hide();
				this.renameElement.hide();

				this.pasteElement.on( 'click', ( event )=>{
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					const method	= 'POST';
					let url			= '';
					switch ( this.action )
					{
						case ACTION_COPY:
							url	= `/file/copy`;
							break;

						case ACTION_CUT:
							url	= `/file/cut`;
							break;

						case ACTION_NONE:
						default:
							alert( 'There is nothing to paste!' );
							return;
					}

					$.ajax({
						url,
						method,
						data	: {
							newPath: this.view.currentDir,
							oldPath: this.actionElementPath
						},
						success	: ( data )=>
						{
							this.view.fetchDataForFileAndAddItem( encodeURIComponent( JSON.parse( data ).newPath ) );
						},
						complete	: () =>
						{
							this.flushActionElementData();
							this.closeContextMenu();
						}
					});

					this.element.hide();
				} ).show();
				return;
		}

		this.pasteElement.hide();

		this.deleteElement.on( 'click', ( event )=>{
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			target.find( '.itemDelete ' ).click();
			this.element.hide();
		} ).show();
	}

	/**
	 * @brief	Gets the current element path
	 *
	 * @param	jQueryElement targetElement
	 *
	 * @returns	String
	 */
	getElementPath( targetElement )
	{
		return targetElement.closest( '.item' ).attr( 'data-item-encoded-uri' );
	}

	/**
	 * @brief	Attaches events related to showing the context menu
	 *
	 * @return	void
	 */
	attachEvents()
	{
		this.document.on( 'contextmenu', '.item', ( e )=>
		{
			this.closeContextMenu();

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			if ( ! this.shouldShowBox( e ) )
			{
				return ;
			}

			this.showContextMenu( e );
		});

		/**
		 * @brief	Hide the context menu on right click outside of it
		 *
		 * @details	Disable the default right click
		 */
		$( document ).on( 'contextmenu', ( e )=>{
			this.closeContextMenu();

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			this.showContextMenu( e );
		});

		/**
		 * @brief	Hide the context menu on click outside of it
		 */
		$( document ).click( ()=>{ this.closeContextMenu(); } );
	}

	/**
	 * @brief	Calculates the top and left position of the context menu
	 *
	 * @param	Event event
	 *
	 * @return	Object
	 */
	calculateOffset( event )
	{
		const winWidth	= this.document.width();
		const winHeight	= this.document.height();
		const posX		= event.pageX;
		const posY		= event.pageY;

		let posLeft, posTop;

		if( posX + this.elementWidth + this.offset >= winWidth && posY + this.elementHeight + this.offset >= winHeight )
		{
			posLeft	= posX - this.elementWidth - this.offset;
			posTop	= posY - this.elementHeight - this.offset;
		}
		else if ( posX + this.elementWidth + this.offset >= winWidth )
		{
			posLeft	= posX - this.elementWidth - this.offset;
			posTop	= posY + this.offset;
		}
		else if( posY + this.elementHeight + this.offset >= winHeight )
		{
			posLeft	= posX + this.offset;
			posTop	= posY - this.elementHeight - this.offset;
		}
		else
		{
			posLeft	= posX + this.offset;
			posTop	= posY + this.offset;
		}

		return { left: posLeft + 'px', top: posTop + 'px' };
	}
}
