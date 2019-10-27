window.Dropzone.autoDiscover	= false;
let canBrowse					= true;

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
		parallelUploads: 3,
		maxFilesize: 20000
	}
);

myDropzone.on( 'addedfile', () => { canBrowse = false; } );
myDropzone.on( 'queuecomplete', () => { canBrowse = true; } );

myDropzone.on("complete", function(file) {
	const encodedURI	= currentDir + encodeURIComponent( '\\' + file.name );

	$.ajax({
		url		: '/file/hasPreview?file=' + encodedURI,
		method	: 'GET',
		success	: function( data )
		{
			const previewAvailable  = JSON.parse( data );
			addItem( file.name, encodedURI, file.size, false, previewAvailable, currentDir );
		}
	});

	setTimeout(()=>{
		myDropzone.removeFile(file);
	}, 4000 )
});

$( document ).on( 'click', '.file-delete', ( event ) => {
	let element			= $( event.target ).closest( '.file-delete' );
	let fileToDelete	= element.attr( 'data-folder' );

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

function addItem( name, encodedURI, size, isDir, previewAvailable, directory )
{
	const fullName	= name;
	size			= bytesToSize( size );
	let element		= null;

	if ( isDir === true )
	{
		element			= $( '#template-folder-card' ).clone();
		name			= name.length > 17 ? name.trunc( 17 ) : name;
		element.addClass( 'item' );

		element.find( '.folder-name' ).text( name ).attr( 'data-href', encodedURI ).attr( 'title', fullName );

		if ( fullName.toLowerCase() !== 'back' )
		{
			element.find( '.folder-delete' ).attr( 'data-folder', encodedURI );
		}
		else
		{
			element.find( '.folder-delete' ).remove();
		}

		element.on( 'dblclick', ( event )=>{
			if ( ! canBrowse || event.target.closest( '.folder-delete' ) !== null  )
			{
				return;
			}
			element.off( 'dblclick' );
			history.pushState( {}, document.getElementsByTagName("title")[0].innerHTML, '/browse?dir=' + encodedURI );
			browse( encodedURI );
		});
		element.appendTo( '#directoryStructure' ).removeAttr( 'id' ).show();
	}
	else
	{
		element	= $( '#template-file-card' ).clone();
		element.addClass( 'item' );
		name			= name.length > 30 ? name.trunc( 30 ) : name;

		element.find( '.folder' ).remove();
		element.find( '.file-name' ).text( name ).attr( 'title', fullName );
		element.find( '.file-size' ).text( size );
		element.find( '.file-download' ).attr( 'href', '/download?file=' + encodedURI );
		element.find( '.file-delete' ).attr( 'data-file', encodedURI );
		if ( previewAvailable )
		{
			element.find( '.file-preview' ).addClass( 'has-preview' ).attr( 'href', '/preview?file=' + encodedURI + '&backDir=' + directory );
		}
		else
		{
			element.find( '.file-preview' ).addClass( 'no-preview' );
		}

		element.appendTo( '#fileStructure' ).removeAttr( 'id' ).show();
	}

	return element;
}

function addAddFolderButton()
{
	const addFolderElement	= addItem( 'Add Folder', '', 0, true, false, null );
	addFolderElement.find( '.folder-delete' ).remove();
	addFolderElement.find( '.item-row' ).addClass( 'add-folder' );
	addFolderElement.off( 'dblclick' );

	addFolderElement.on( 'click', ()=>{
		const userFolder	= prompt( 'Please enter the name of the folder.', 'New Folder' );
		const folderName	= userFolder;
		const encodedUri	= currentDir + encodeURIComponent( '/' + userFolder );

		$.ajax({
			url		: '/create/folder',
			data	: {
				folder: encodedUri
			},
			method	: 'POST',
			success	: function()
			{
				addFolderElement.remove();
				addItem( folderName, encodedUri, 0, true, false, null );
				addAddFolderButton();
			}
		});
	} );
}

function browse( directory )
{
	if ( ! canBrowse )
	{
		return;
	}
	currentDir  = directory;
	$( '#upload-dir' ).val( directory );
	$( '#upload-file' ).val( directory );

	$.ajax({
		url		: '/browse/getFiles?dir=' + directory,
		method	: 'GET',
		success	: function( data )
		{
			$( '.item' ).remove();

			data		= JSON.parse( data );
			const items	= data['items'];

			for ( const index in items )
			{
				const row	= items[index];
				addItem( row['name'], row['encodedURI'], row['size'], row['isDir'], row['previewAvailable'], data['dir'] );
			}

			addAddFolderButton();
		}
	});
}

browse( currentDir );