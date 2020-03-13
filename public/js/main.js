window.Dropzone.autoDiscover	= false;

/**
 * @brief	View Class responsible for altering the page
 */
class View
{
	constructor()
	{
		this.canBrowse			= true;
		this.currentPosition	= 0;
		this.contextMenu		= new ContextMenu( this );
		this.dropzone			= new Dropzone(
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
		$( window ).on('popstate', () =>
			{
				const url	= new URL( window.location.href );
				this.browse( url.searchParams.get( 'dir' ) );
			}
		);

		this.dropzone.on( 'addedfile', () => { this.canBrowse	= false; } );
		this.dropzone.on( 'queuecomplete', () => { this.canBrowse	= true; } );

		this.dropzone.on( 'complete', ( file ) => {
			const encodedURI	= this.currentDir + encodeURIComponent( '/' + file.name );

			this.fetchDataForFileAndAddItem( encodedURI );

			setTimeout(()=>{
				this.dropzone.removeFile( file );
			}, 4000 );
		});

		$( document ).on( 'click', '.file-delete', ( event ) => {
			this.deleteItem( $( event.target ), View.TYPE_FILE );
			return false;
		});

		$( document ).on( 'click', '.folder-delete', ( event ) => {
			this.deleteItem( $( event.target ), View.TYPE_FOLDER );
			return false;
		});

		$( '#addFolder' ).on( 'click', ( event )=>{
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			modal.askUserInput( 'Please enter the name of the folder.', 'New Folder' ).then(( userFolder )=>{
				if ( userFolder == null || userFolder === '' )
				{
					return;
				}

				const folderName		= userFolder;
				const encodedFolderName	= encodeURIComponent( '/' + userFolder );
				const encodedUri		= decodeURIComponent( this.currentDir ) === '/' ? encodedFolderName : this.currentDir + encodedFolderName;

				$.ajax({
					url		: '/folder',
					data	: {
						folder: encodedUri
					},
					method		: 'POST',
					success	: ()=>
					{
						this.addItem( folderName, encodedUri, 0, true, false, 'directory', null );
					},
					error	: this.showError.bind( this )
				});
			});

			return false;
		});
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
			success	: ( data )=> {
				const itemData														= JSON.parse( data );
				const { name, encodedURI, size, isDir, fileType, previewAvailable }	= itemData;

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
	deleteItem( element, type = View.TYPE_FILE )
	{
		element				= element.closest( '.item' );
		const itemToDelete	= element.attr( 'data-item-encoded-uri' );

		if ( ! itemToDelete )
		{
			return;
		}

		const deleteItemAjax	= ()=>{
			$.ajax({
				url		: `/${type}?item=${itemToDelete}`,
				method	: 'DELETE',
				success	: function()
				{
					element.remove();
				}
			});
		};

		if ( type === View.TYPE_FOLDER )
		{
			modal.askConfirmation( `Are you sure you want to delete this item?` ).then(( confirmDelete )=>{
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
		if ( ! this.canBrowse && ! loadData )
		{
			return;
		}

		if ( ! loadData )
		{
			this.currentPosition	= 0;
			this.currentDir		= directory;
		}

		$( '#upload-dir' ).val( directory );
		$( '#upload-file' ).val( directory );

		$.ajax({
			url		: `/browse/getFiles?dir=${directory}&position=${this.currentPosition}`,
			method	: 'GET',
			success	: ( data )=>
			{
				if ( ! loadData )
				{
					$( '.item' ).remove();
				}

				const { items, position, hasMore, dir }	= JSON.parse( data );

				if ( dir !== decodeURIComponent( this.currentDir ) )
				{
					return;
				}
				this.currentPosition	= position;

				for ( const index in items )
				{
					const row															= items[index];
					const { name, encodedURI, size, isDir, fileType, previewAvailable }	= row;

					this.addItem( name, encodedURI, size, isDir, previewAvailable, fileType, dir );
				}

				if ( hasMore )
				{
					setTimeout( ()=>{
						if ( dir !== decodeURIComponent( this.currentDir ) )
						{
							return;
						}

						this.browse( directory, true );
					}, 500 );
				}
			},
			error	: this.showError.bind( this )
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

			element.find( '.folder-name' ).attr( 'data-href', encodedURI ).attr( 'title', fullName );

			element.on( 'click', ( event )=>{
				if ( ! this.canBrowse || event.target.closest( '.folder-delete' ) !== null  )
				{
					return;
				}
				element.off( 'click' );
				history.pushState( {}, document.getElementsByTagName( 'title' )[0].innerHTML, '/browse?dir=' + encodedURI );
				this.browse( encodedURI );
			});

			this.setItemNameToFit( element, '.folder-name', '.item-row', fullName, 20, 55 );
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
						<img style="padding-bottom: 7px; max-width: 250px; max-height: 250px" class="preview-item" src="/file/data?file=${encodedURI}" alt="${name}">
					` );

					filePreviewElement	= filePreviewParent;
				}
				else
				{
					filePreviewElement.addClass( 'has-preview' ).removeClass( 'no-preview' );
				}

				filePreviewElement.on( 'click',( event )=>{
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

			this.setItemNameToFit( element, '.file-name', '.item-row', fullName, 30, 90 );
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

View.TYPE_FILE		= 'file';
View.TYPE_FOLDER	= 'folder';

const view	= new View();

view.browse( currentDir );
