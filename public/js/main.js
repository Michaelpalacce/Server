window.Dropzone.autoDiscover	= false;
let canBrowse					= true;
let currentPosition				= 0;

$( window ).on('popstate', () =>
	{
		const url	= new URL( window.location.href );
		browse( url.searchParams.get( 'dir' ) );
	}
);

String.prototype.trunc = String.prototype.trunc ||
	function(n){
		return (this.length > n) ? this.substr(0, n-1) + '...' : this;
	};

const myDropzone				= new Dropzone(
	".dropzone",
	{
		url: "/upload",
		parallelUploads: 5,
		maxFilesize: 40000,
		timeout:0
	}
);

myDropzone.on( 'addedfile', () => { canBrowse = false; } );
myDropzone.on( 'queuecomplete', () => { canBrowse = true; } );

myDropzone.on("complete", function(file) {
	const encodedURI	= currentDir + encodeURIComponent( '\\' + file.name );

	$.ajax({
		url		: '/file/getFileData?file=' + encodedURI,
		method	: 'GET',
		success	: function( data )
		{
			const itemData														= JSON.parse( data );
			const { name, encodedURI, size, isDir, fileType, previewAvailable }	= itemData;

			addItem( name, encodedURI, size, isDir, previewAvailable, fileType, currentDir );
		}
	});

	setTimeout(()=>{
		myDropzone.removeFile(file);
	}, 4000 )
});

$( document ).on( 'click', '.file-delete', ( event ) => {
	let element			= $( event.target ).closest( '.file-delete' );
	let fileToDelete	= element.attr( 'data-file' );

	$.ajax({
		url		: '/delete?file=' + fileToDelete,
		method	: 'DELETE',
		success	: function()
		{
			element.closest( '.item' ).remove();
		}
	});
});

$( document ).on( 'click', '.folder-delete', ( event ) => {
	let element			= $( event.target ).closest( '.folder-delete' );
	let folderToDelete	= element.attr( 'data-folder' );
	const confirmDelete	= confirm( `Are you sure you want to delete this folder?` );

	if ( ! confirmDelete )
	{
		return;
	}

	$.ajax({
		url		: '/delete/folder?folder=' + folderToDelete,
		method	: 'DELETE',
		success	: function()
		{
			element.closest( '.item' ).remove();
		}
	});
});

function bytesToSize(bytes)
{
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function setItemNameToFit( element, nameElementClass, compareElementClass, fullName, truncStart )
{
	const compareElement		= element.find( compareElementClass );
	const nameElement			= element.find( nameElementClass );
	const compareElementWidth	= compareElement.width();
	const offset				= 45;

	nameElement.text( fullName );

	while ( true )
	{
		let nameElementWidth	= nameElement.width();

		if ( compareElementWidth - offset < nameElementWidth )
		{
			let newName	= fullName.trunc( truncStart );
			nameElement.text( fullName.trunc( truncStart ) );
			truncStart	-= 2;
		}
		else
		{
			break;
		}
	}
}

function addItem( name, encodedURI, size, isDir, previewAvailable, itemType, directory )
{
	const fullName	= name;
	size			= bytesToSize( size );
	let element		= null;

	if ( isDir === true )
	{
		element			= $( '#template-folder-card' ).clone();
		element.addClass( 'item' );

		element.find( '.folder-name' ).attr( 'data-href', encodedURI ).attr( 'title', fullName );

		if ( fullName.toLowerCase() !== 'back' )
		{
			element.find( '.folder-delete' ).attr( 'data-folder', encodedURI );
		}
		else
		{
			element.find( '.folder-delete' ).remove();
		}

		element.on( 'click', ( event )=>{
			if ( ! canBrowse || event.target.closest( '.folder-delete' ) !== null  )
			{
				return;
			}
			element.off( 'click' );
			history.pushState( {}, document.getElementsByTagName("title")[0].innerHTML, '/browse?dir=' + encodedURI );
			browse( encodedURI );
		});
		element.appendTo( '#directoryStructure' ).removeAttr( 'id' ).show();

		setItemNameToFit( element, '.folder-name', '.item-row', fullName, 20 );
	}
	else
	{
		element	= $( '#template-file-card' ).clone();
		element.addClass( 'item' );

		element.find( '.folder' ).remove();
		element.find( '.file-name' ).attr( 'title', fullName );
		element.find( '.file-size' ).text( size );
		element.find( '.file-download' ).attr( 'href', '/download?file=' + encodedURI );
		element.find( '.file-delete' ).attr( 'data-file', encodedURI );
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

		setItemNameToFit( element, '.file-name', '.item-row', fullName, 30 );
	}

	return element;
}

function addAddFolderButton()
{
	$( '.addFolderElement' ).remove();

	const addFolderElement	= addItem( 'Add Folder', '', 0, true, false, 'directory', null );
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

		const folderName	= userFolder;
		const encodedUri	= currentDir + encodeURIComponent( '/' + userFolder );

		$.ajax({
			url		: '/create/folder',
			data	: {
				folder: encodedUri
			},
			method		: 'POST',
			success	: function()
			{
				addItem( folderName, encodedUri, 0, true, false, 'directory', null );
				addAddFolderButton();
			},
			error	: function ()
			{
				alert( 'Could not create folder' );
			}
		});
	} );
}

function browse( directory, loadData = false )
{
	if ( ! canBrowse && ! loadData )
	{
		return;
	}

	if ( ! loadData )
	{
		console.log(`SETTING NEW DIRECTORY: ${directory}`)
		currentPosition	= 0;
		currentDir		= directory;
	}

	$( '#upload-dir' ).val( directory );
	$( '#upload-file' ).val( directory );

	$.ajax({
		url		: `/browse/getFiles?dir=${directory}&position=${currentPosition}`,
		method	: 'GET',
		success	: function( data )
		{
			if ( ! loadData )
			{
				$( '.item' ).remove();
			}

			data											= JSON.parse( data );
			const { items, position, hasMore, workingDir }	= data;

			if ( workingDir !== decodeURIComponent( currentDir ) )
			{
				return;
			}

			currentPosition									= position;

			for ( const index in items )
			{
				const row															= items[index];
				const { name, encodedURI, size, isDir, fileType, previewAvailable }	= row;

				addItem( name, encodedURI, size, isDir, previewAvailable, fileType, data['dir'] );
			}

			addAddFolderButton();

			if ( hasMore )
			{
				setTimeout( ()=>{
					if ( workingDir !== decodeURIComponent( currentDir ) )
					{
						return;
					}

					browse( directory, true );
				}, 2000 );
			}
		}
	});
}

browse( currentDir );