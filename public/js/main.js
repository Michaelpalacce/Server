window.Dropzone.autoDiscover	= false;
let canBrowse					= true;
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
	let element			= $( event.target );
	let fileToDelete	= element.attr( 'data-file' );
	fileToDelete		= decodeURIComponent( fileToDelete );
	$.ajax({
		url		: '/delete?file=' + fileToDelete,
		method	: 'DELETE',
		success	: function()
		{
			element.closest( '.card' ).remove();
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
	size			= bytesToSize( size );
	const element	= $( '#template-card' ).clone();

	element.addClass( 'item' );

	if ( isDir === true )
	{
		element.find( '.file' ).remove();
		element.find( '.folder-name' ).text( name ).attr( 'data-href', encodedURI );

		element.find( '.folder-name' ).on( 'click', ()=>{
			if ( ! canBrowse )
			{
				return;
			}
			element.find( '.folder-name' ).off( 'click' );
			history.pushState( {}, document.getElementsByTagName("title")[0].innerHTML, '/browse?dir=' + encodedURI );
			browse( encodedURI );
		});
	}
	else
	{
		element.find( '.folder' ).remove();
		element.find( '.file-name' ).text( name );
		element.find( '.file-size' ).text( size );
		element.find( '.file-download' ).attr( 'href', '/download?file=' + encodedURI );
		element.find( '.file-delete' ).attr( 'data-file', encodedURI );
		if ( previewAvailable )
		{
			element.find( '.file-preview' ).attr( 'href', '/preview?file=' + encodedURI + '&backDir=' + directory );
		}
		else
		{
			element.find( '.file-preview' ).addClass( 'no-preview' );
		}
	}

	element.appendTo( '#directoryStructure' ).removeAttr( 'id' ).show();
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
		}
	});
}


browse( currentDir );