'use strict';

const ACTION_NONE			= 0;
const ACTION_COPY			= 1;
const ACTION_CUT			= 2;

const ACTION_TYPE_NONE		= '';
const ACTION_TYPE_FOLDER	= 'folder';
const ACTION_TYPE_FILE		= 'file';

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
		this.newFolderElement	= this.element.find( '#context-new-folder' );

		this.elementWidth		= this.element.width();
		this.elementHeight		= this.element.height();
		this.offset				= 10;

		this.action				= ACTION_NONE;
		this.actionElementPath	= '';
		this.actionElementType	= '';

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
		this.newFolderElement.off( 'click' );
	}

	/**
	 * @brief	Flushes element data
	 *
	 * @return	void
	 */
	flushActionElementData()
	{
		this.action				= ACTION_NONE;
		this.actionElementPath	= '';
		this.actionElementType	= ACTION_TYPE_NONE;
	}

	/**
	 * @brief	Renames the item
	 *
	 * @param	Event event
	 * @param	Element target
	 *
	 * @return	Boolean
	 */
	renameCallback( event, target )
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.element.hide();

		const oldName	= target.closest( '.item' ).attr( 'data-item-name' );
		const itemType	= this.getElementType( target );

		modal.askUserInput( 'What is the new name of the item', oldName ).then( ( newName )=>{
			const decodedCurrentDir	= atob( decodeURIComponent( this.view.currentDir ) );

			$.ajax({
				url		: `/${itemType}/rename`,
				method	:'POST',
				data	: {
					newPath: encodeURIComponent( btoa( `${decodedCurrentDir}/${newName}` ) ),
					oldPath: this.getElementPath( target )
				},
				success	: ( data )=>
				{
					target.remove();
					this.view.fetchDataForFileAndAddItem( JSON.parse( data ).newPath );
					this.flushActionElementData();
				},
				error	: this.view.showError.bind( this.view )
			});
		});

		return false;
	}

	/**
	 * @brief	Cut the items to a new place
	 *
	 * @param	event Event
	 * @param	target Element
	 *
	 * @return	Boolean
	 */
	cutCallback( event, target )
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		this.action				= ACTION_CUT;
		this.actionElementPath	= this.getElementPath( target );
		this.actionElementType	= this.getElementType( target );
		this.element.hide();

		return false;
	}

	/**
	 * @brief	Copy the items to a new place
	 *
	 * @param	event Event
	 * @param	target Element
	 *
	 * @return	Boolean
	 */
	copyCallback( event, target )
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		this.action				= ACTION_COPY;
		this.actionElementPath	= this.getElementPath( target );
		this.actionElementType	= this.getElementType( target );
		this.element.hide();

		return false;
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
				this.newFolderElement.hide();

				const folderDownloadLink	= this.getElementPath( target );
				this.downloadElement.show().attr( 'href', `/file?file=${folderDownloadLink}` );

				this.renameElement.on( 'click', ( event )=>{ return this.renameCallback( event, target ); } ).show();
				this.cutElement.on( 'click', ( event )=>{ return this.cutCallback( event, target ); } ).show();
				this.copyElement.on( 'click', ( event )=>{ return this.copyCallback( event, target ); } ).show();
				break;

			case target.hasClass( 'file' ):
				this.newFolderElement.hide();

				const fileDownloadLink	= target.find( '.file-download' ).attr( 'href' );
				this.downloadElement.show().attr( 'href', fileDownloadLink );

				this.cutElement.on( 'click', ( event )=>{ return this.cutCallback( event, target ); } ).show();
				this.copyElement.on( 'click', ( event )=>{ return this.copyCallback( event, target ); } ).show();
				this.renameElement.on( 'click', ( event )=>{ return this.renameCallback( event, target ); } ).show();
				break;

			default:
				this.downloadElement.hide();
				this.deleteElement.hide();
				this.cutElement.hide();
				this.copyElement.hide();
				this.renameElement.hide();

				this.newFolderElement.on( 'click', ( event )=>{
					this.element.hide();
					view.createNewFolder( event );
				} ).show();

				this.pasteElement.on( 'click', ( event )=>{
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					this.element.hide();

					const method	= 'POST';
					let url			= '';
					switch ( this.action )
					{
						case ACTION_COPY:
							url	= `/${this.actionElementType}/copy`;
							break;

						case ACTION_CUT:
							url	= `/${this.actionElementType}/cut`;
							break;

						case ACTION_NONE:
						default:
							modal.show( 'There is nothing to paste!' );
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
							this.view.fetchDataForFileAndAddItem( JSON.parse( data ).newPath );
						},
						complete	: () =>
						{
							this.flushActionElementData();
							this.closeContextMenu();
						},
						error	: this.view.showError.bind( this.view )
					});
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
	 * @param	targetElement jQueryElement
	 *
	 * @returns	String
	 */
	getElementPath( targetElement )
	{
		return targetElement.closest( '.item' ).attr( 'data-item-encoded-uri' );
	}

	/**
	 * @brief	Gets the current element type
	 *
	 * @param	targetElement jQueryElement
	 *
	 * @returns	String
	 */
	getElementType( targetElement )
	{
		const itemType	= targetElement.closest( '.item' ).attr( 'data-item-type' );

		return  itemType === ACTION_TYPE_FOLDER ? itemType : ACTION_TYPE_FILE;
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
