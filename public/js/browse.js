window.Dropzone.autoDiscover	= false;

/**
 * @brief	View Class responsible for altering the page
 */
class Browse
{
	constructor()
	{
		this.canBrowse		= true;
		this.hasMore		= false;
		this.currentToken	= '';
		this.contextMenu	= new ContextMenu( this );
		this.dropzone		= new Dropzone(
			".dropzone",
			{
				url: '/file',
				method: 'post',
				parallelUploads: 5,
				maxFilesize: 40000,
				timeout:0
			}
		);

		String.prototype.trunc = String.prototype.trunc || function( n ) {
			return ( this.length > n) ? this.substr( 0, n - 1 ) + '...' : this;
		};

		this.attachEvents();
	}

	/**
	 * @brief	Attaches Dropzone Element events
	 *
	 * @return	void
	 */
	attachEvents()
	{
		$( window ).on( 'popstate', () =>
			{
				const url	= new URL( window.location.href );
				this.browse( url.searchParams.get( 'dir' ) );
			}
		);

		this.dropzone.on( 'addedfile', () => { this.canBrowse	= false; } );
		this.dropzone.on( 'queuecomplete', () => { this.canBrowse	= true; } );

		this.dropzone.on( 'success', ( file ) => {
			const decodedCurrentDir	= atob( decodeURIComponent( this.currentDir ) );
			const encodedURI		= encodeURIComponent( btoa( `${decodedCurrentDir}/${file.name}` ) );

			this.fetchDataForFileAndAddItem( encodedURI );

			setTimeout(() => {
				this.dropzone.removeFile( file );
			}, 2000 );
		});

		this.dropzone.on( 'error', ( file, error ) => {
			modal.hide();

			modal.show( error );
		});

		$( document ).on( 'click', '.file-delete', ( event ) => {
			this.deleteItem( $( event.target ), Browse.TYPE_FILE );
			return false;
		});

		$( document ).on( 'click', '.folder-delete', ( event ) => {
			this.deleteItem( $( event.target ), Browse.TYPE_FOLDER );
			return false;
		});

		$( '#addFolder' ).on( 'click', this.createNewFolder.bind( this ) );

		$( window ).on( 'scroll', this.tryToLoad.bind( this ) );
	}

	/**
	 * @brief	Tries loading if conditions are met
	 *
	 * @return	Boolean
	 */
	tryToLoad()
	{
		if ( ! this.hasMore )
		{
			return false;
		}

		const documentScrollTop		= $( document ).scrollTop();
		const documentOuterHeight	= $( document ).outerHeight();
		const windowOuterHeight		= $( window ).outerHeight();
		const offset				= 500;

		if ( documentScrollTop >= documentOuterHeight - windowOuterHeight - offset )
		{
			this.browse( this.currentDir, true );
		}
	}

	/**
	 * @brief	Creates a new folder
	 *
	 * @param	event Event
	 *
	 * @return	boolean
	 */
	createNewFolder( event )
	{
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		modal.askUserInput( 'Please enter the name of the folder.', 'New Folder' ).then(( userFolder ) => {
			if ( userFolder == null || userFolder === '' )
			{
				return;
			}

			const folderName		= userFolder;
			const decodedCurrentDir	= atob( decodeURIComponent( this.currentDir ) );

			const encodedUri		= decodedCurrentDir === '/'
									? encodeURIComponent( btoa( `/${userFolder}` ) )
									: encodeURIComponent( btoa( `${decodedCurrentDir}/${userFolder}` ) );

			$.ajax({
				url		: '/folder',
				data	: {
					directory: encodedUri
				},
				method		: 'POST',
				success	: () => {
					this.addItem( folderName, encodedUri, 0, true, false, 'directory', null );
				},
				error	: this.showError.bind( this )
			});
		});

		return false;
	}

	/**
	 * @brief	Retrieves the FileData and adds an item
	 *
	 * @details	The filePath must be already URI encoded
	 *
	 * @param	String filePath
	 *
	 * @return	void
	 */
	fetchDataForFileAndAddItem( filePath )
	{
		$.ajax({
			url		: '/file/getFileData?file=' + filePath,
			method	: 'GET',
			success	: ( data ) => {
				const itemData														= JSON.parse( data );
				const { name, encodedURI, size, isDir, fileType, previewAvailable }	= itemData;

				const duplicateElement	= $( `*[data-item-name="${name}"]` )[0];
				if ( duplicateElement !== undefined )
				{
					duplicateElement.remove();
				}

				this.addItem( name, encodedURI, size, isDir, previewAvailable, fileType, this.currentDir );
			},
			error	: this.showError.bind( this )
		});
	}

	/**
	 * @brief	Deletes an item
	 *
	 * @param	element jQueryElement
	 * @param	type Boolean
	 *
	 * @return	void
	 */
	deleteItem( element, type = Browse.TYPE_FILE )
	{
		element.off( 'click' );

		element				= element.closest( '.item' );
		const itemToDelete	= element.attr( 'data-item-encoded-uri' );

		if ( ! itemToDelete )
		{
			return;
		}

		const deleteItemAjax	= () => {
			$.ajax({
				url		: `/${type}?item=${itemToDelete}`,
				method	: 'DELETE',
				success	: () => {
					element.remove();
					this.tryToLoad();
				},
				error	: this.showError.bind( this )
			});
		};

		if ( type === Browse.TYPE_FOLDER )
		{
			modal.askConfirmation( `Are you sure you want to delete this item?` ).then(( confirmDelete ) => {
				if ( ! confirmDelete )
				{
					return;
				}

				deleteItemAjax();
			});

			return;
		}

		deleteItemAjax();
	}

	/**
	 * @brief	Converts bytes to KB,MB,GB,TB
	 *
	 * @param	Number bytes
	 *
	 * @returns	String
	 */
	bytesToSize( bytes )
	{
		const sizes	= ['B', 'KB', 'MB', 'GB', 'TB'];
		if ( bytes === 0 )
			return '0 B';

		const i	= parseInt( Math.floor( Math.log( bytes ) / Math.log( 1024 ) ) );

		return Math.round( bytes / Math.pow( 1024, i ), 2 ) + ' ' + sizes[i];
	}

	/**
	 * @brief	Sets the Item name to fit the box
	 *
	 * @param	jQueryElement element
	 * @param	String nameElementClass
	 * @param	String compareElementClass
	 * @param	String fullName
	 * @param	Number truncStart
	 *
	 * @return	void
	 */
	setItemNameToFit( element, nameElementClass, compareElementClass, fullName, truncStart, offset = 55 )
	{
		const compareElement		= element.find( compareElementClass );
		const nameElement			= element.find( nameElementClass );
		const compareElementWidth	= compareElement.width();

		nameElement.text( fullName );

		while ( true )
		{
			const nameElementWidth	= nameElement.width();

			if ( compareElementWidth - offset < nameElementWidth )
			{
				nameElement.text( fullName.trunc( truncStart ) );
				truncStart	-= 2;
			}
			else
			{
				break;
			}
		}
	}

	/**
	 * @brief	Change the currentDirectory and browse to that path
	 *
	 * @param	String directory
	 * @param	Boolean loadData
	 *
	 * @return	void
	 */
	browse( directory, loadData = false )
	{
		if ( this.loading )
		{
			return;
		}

		const pastDir		= this.currentDir;
		const pastToken		= this.currentToken;
		const pastHasMore	= this.hasMore;

		if ( ! this.canBrowse && ! loadData )
		{
			return;
		}

		if ( ! loadData )
		{
			this.currentToken	= '';
			this.currentDir		= directory;
			this.hasMore		= false;
		}
		this.loading			= true;

		$( '#upload-dir' ).val( directory );
		$( '#upload-file' ).val( directory );

		$.ajax({
			url		: `/browse/getFiles?dir=${directory}&token=${this.currentToken}`,
			method	: 'GET',
			success	: ( data ) => {
				if ( ! loadData )
				{
					$( '.item' ).remove();
				}

				const { items, hasMore, dir, nextToken }	= JSON.parse( data );
				this.currentToken							= nextToken;

				for ( const index in items )
				{
					const row															= items[index];
					const { name, encodedURI, size, isDir, fileType, previewAvailable }	= row;

					this.addItem( name, encodedURI, size, isDir, previewAvailable, fileType, dir );
				}

				this.hasMore	= hasMore;
			},
			error	: ( jqXHR ) => {
				if ( pastDir !== undefined )
				{
					window.history.pushState( {}, '', `/browse?dir=${pastDir}` );
				}
				else
				{
					window.history.pushState( {}, '', `/` );
				}

				this.currentDir		= pastDir;
				this.currentToken	= pastToken;
				this.hasMore		= pastHasMore;

				$( '#upload-dir' ).val( this.currentDir );
				$( '#upload-file' ).val( this.currentDir );

				this.showError( jqXHR );
			},
			complete	: () => {
				this.loading	= false;
			}
		});
	}

	/**
	 * @brief	Adds an item to the page
	 *
	 * @param	String name
	 * @param	String encodedURI
	 * @param	Number size
	 * @param	Boolean isDir
	 * @param	Boolean previewAvailable
	 * @param	String itemType
	 * @param	String directory
	 *
	 * @return	jQueryElement
	 */
	addItem( name, encodedURI, size, isDir, previewAvailable, itemType, directory )
	{
		const fullName	= name;
		size			= this.bytesToSize( size );
		let element		= null;

		if ( isDir === true )
		{
			switch ( fullName.toLowerCase() )
			{
				case 'back':
					element	= $( '#template-folder-card-back' ).clone();
					element.appendTo( '#backButtonPlace' ).removeAttr( 'id' ).show();
					break;

				default:
					element	= $( '#template-folder-card' ).clone();
					element.appendTo( '#directoryStructure' ).removeAttr( 'id' ).show();
					break;
			}

			element.addClass( 'item' );
			element.attr( 'data-item-name', fullName );
			element.attr( 'data-item-encoded-uri', encodedURI );
			element.attr( 'data-item-type', 'folder' );

			element.find( '.folder-name' ).attr( 'data-href', encodedURI ).attr( 'title', fullName );

			element.on( 'click', ( event ) => {
				if ( ! this.canBrowse || event.target.closest( '.folder-delete' ) !== null  )
				{
					return;
				}
				element.off( 'click' );
				history.pushState( {}, document.getElementsByTagName( 'title' )[0].innerHTML, '/browse?dir=' + encodedURI );
				this.browse( encodedURI );
			});

			this.setItemNameToFit( element, '.folder-name', '.item-row', fullName, 20, 40 );
		}
		else
		{
			element	= $( '#template-file-card' ).clone();
			element.addClass( 'item' );
			element.attr( 'data-item-name', fullName );
			element.attr( 'data-item-type', itemType );
			element.attr( 'data-item-encoded-uri', encodedURI );

			element.find( '.folder' ).remove();
			element.find( '.file-name' ).attr( 'title', fullName );
			element.find( '.file-size' ).text( size );
			element.find( '.file-download' ).attr( 'href', '/file?file=' + encodedURI );
			if ( previewAvailable )
			{
				let filePreviewElement	= element.find( '.file-preview' );
				if ( itemType === 'image' )
				{
					const filePreviewParent	= filePreviewElement.parent().parent();
					filePreviewElement.parent().remove();

					filePreviewParent.append( `
						<img class="preview-item" src="/file/data?file=${encodedURI}" alt="${name}">
					` );

					filePreviewElement	= filePreviewParent;
				}
				else
				{
					filePreviewElement.addClass( 'has-preview' ).removeClass( 'no-preview' );
				}

				filePreviewElement.on( 'click',( event ) => {
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();

					modal.showPreview( itemType, encodedURI );

					return false;
				});
			}
			else
			{
				element.find( '.file-preview' ).addClass( 'no-preview' );
			}

			element.appendTo( '#fileStructure' ).removeAttr( 'id' ).show();

			this.setItemNameToFit( element, '.file-name', '.item-row', fullName, 30, 80 );
		}

		return element;
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

Browse.TYPE_FILE	= 'file';
Browse.TYPE_FOLDER	= 'folder';

const view			= new Browse();

view.browse( $( '#currentDir' ).attr( 'data-currentDir' ) );
