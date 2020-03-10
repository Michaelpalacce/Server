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

		const myDropzone				= new Dropzone(
			".dropzone",
			{
				url: "/upload",
				parallelUploads: 5,
				maxFilesize: 40000,
				timeout:0
			}
		);

		myDropzone.on( 'addedfile', () => { this.canBrowse	= false; } );
		myDropzone.on( 'queuecomplete', () => { this.canBrowse	= true; } );

		myDropzone.on("complete", ( file ) => {
			const encodedURI	= this.currentDir + encodeURIComponent( '/' + file.name );

			this.fetchDataForFileAndAddItem( encodedURI );

			setTimeout(()=>{
				myDropzone.removeFile( file );
			}, 4000 );
		});

		$( document ).on( 'click', '.file-delete', ( event ) => {
			this.deleteItem( $( event.target ).closest( '.file-delete' ) );
		});
		$( document ).on( 'click', '.folder-delete', ( event ) => {
			this.deleteItem( $( event.target ).closest( '.folder-delete' ), true );
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
			}
		});
	}

	/**
	 * @brief	Deletes an item
	 *
	 * @param	jQueryElement element
	 * @param	Boolean showConfirmDialog
	 *
	 * @return	void
	 */
	deleteItem( element, showConfirmDialog = false )
	{
		const itemToDelete	= element.attr( 'data-item' );
		const url			= `/delete?item=${itemToDelete}`;
		const method		= 'DELETE';

		if ( showConfirmDialog )
		{
			const confirmDelete		= confirm( `Are you sure you want to delete this item?` );

			if ( ! confirmDelete )
			{
				return;
			}
		}

		$.ajax({
			url,
			method,
			success	: function()
			{
				element.closest( '.item' ).remove();
			}
		});
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
		const sizes	= ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if ( bytes === 0 )
			return '0 Byte';

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
	setItemNameToFit( element, nameElementClass, compareElementClass, fullName, truncStart )
	{
		const compareElement		= element.find( compareElementClass );
		const nameElement			= element.find( nameElementClass );
		const compareElementWidth	= compareElement.width();
		const offset				= 55;

		nameElement.text( fullName );

		while ( true )
		{
			const nameElementWidth	= nameElement.width();

			if ( compareElementWidth - offset < nameElementWidth )
			{
				let newName	= fullName.trunc( truncStart );
				nameElement.text( newName );
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

				data	= JSON.parse( data );
				const { items, position, hasMore, dir }	= data;

				if ( dir !== decodeURIComponent( this.currentDir ) )
				{
					return;
				}

				this.currentPosition	= position;

				for ( const index in items )
				{
					const row															= items[index];
					const { name, encodedURI, size, isDir, fileType, previewAvailable }	= row;

					this.addItem( name, encodedURI, size, isDir, previewAvailable, fileType, data['dir'] );
				}

				this.addAddFolderButton();

				if ( hasMore )
				{
					setTimeout( ()=>{
						if ( dir !== decodeURIComponent( this.currentDir ) )
						{
							return;
						}

						this.browse( directory, true );
					}, 2000 );
				}
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
			element			= $( '#template-folder-card' ).clone();
			element.addClass( 'item' );
			element.attr( 'data-item-name', fullName );
			element.attr( 'data-item-encoded-uri', encodedURI );

			element.find( '.folder-name' ).attr( 'data-href', encodedURI ).attr( 'title', fullName );

			if ( fullName.toLowerCase() !== 'back' )
			{
				element.find( '.folder-delete' ).attr( 'data-item', encodedURI );
			}
			else
			{
				element.find( '.folder-delete' ).remove();
				element.addClass( 'backFolderElement' )
			}

			element.on( 'click', ( event )=>{
				if ( ! this.canBrowse || event.target.closest( '.folder-delete' ) !== null  )
				{
					return;
				}
				element.off( 'click' );
				history.pushState( {}, document.getElementsByTagName( 'title' )[0].innerHTML, '/browse?dir=' + encodedURI );
				this.browse( encodedURI );
			});
			element.appendTo( '#directoryStructure' ).removeAttr( 'id' ).show();

			this.setItemNameToFit( element, '.folder-name', '.item-row', fullName, 20 );
		}
		else
		{
			element	= $( '#template-file-card' ).clone();
			element.addClass( 'item' );
			element.attr( 'data-item-name', fullName );
			element.attr( 'data-item-encoded-uri', encodedURI );

			element.find( '.folder' ).remove();
			element.find( '.file-name' ).attr( 'title', fullName );
			element.find( '.file-size' ).text( size );
			element.find( '.file-download' ).attr( 'href', '/download?file=' + encodedURI );
			element.find( '.file-delete' ).attr( 'data-item', encodedURI );
			if ( previewAvailable )
			{
				const filePreviewElement	= element.find( '.file-preview' );
				if ( itemType === 'image' )
				{
					const filePreviewParent	= filePreviewElement.parent().parent();
					filePreviewElement.parent().remove();

					filePreviewParent.append( `
					<a href="/preview?file=${encodedURI}">
						<img style="max-height: 250px; max-width: 250px; padding-bottom: 7px" src="/data?file=${encodedURI}" alt="${name}">
					<a/>
				` );
				}
				else
				{
					filePreviewElement.addClass( 'has-preview' ).attr( 'href', '/preview?file=' + encodedURI + '&backDir=' + directory );
				}
			}
			else
			{
				element.find( '.file-preview' ).addClass( 'no-preview' );
			}

			element.appendTo( '#fileStructure' ).removeAttr( 'id' ).show();

			this.setItemNameToFit( element, '.file-name', '.item-row', fullName, 30 );
		}

		return element;
	}

	/**
	 * @brief	Adds the 'Add Folder' Button
	 *
	 * @return	void
	 */
	addAddFolderButton()
	{
		$( '.addFolderElement' ).remove();

		const addFolderElement	= this.addItem( 'Add Folder', '', 0, true, false, 'directory', null );
		addFolderElement.addClass( 'addFolderElement' );
		addFolderElement.find( '.folder-delete' ).remove();
		addFolderElement.find( '.item-row' ).addClass( 'add-folder' );
		addFolderElement.off( 'click' );

		addFolderElement.on( 'click', ()=>{
			const userFolder	= prompt( 'Please enter the name of the folder.', 'New Folder' );

			if ( userFolder == null || userFolder === '' )
			{
				alert( 'Could not create folder' );
				return;
			}

			const folderName		= userFolder;
			const encodedFolderName	= encodeURIComponent( '/' + userFolder );
			const encodedUri		= decodeURIComponent( this.currentDir ) === '/' ? encodedFolderName : this.currentDir + encodedFolderName;

			$.ajax({
				url		: '/create/folder',
				data	: {
					folder: encodedUri
				},
				method		: 'POST',
				success	: ()=>
				{
					this.addItem( folderName, encodedUri, 0, true, false, 'directory', null );
					this.addAddFolderButton();
				},
				error	: function ()
				{
					alert( 'Could not create folder' );
				}
			});
		} );
	}
}

const view	= new View();

view.browse( currentDir );

