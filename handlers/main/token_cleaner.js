'use strict';
// Dependencies
const fs	= require( 'fs' );

// Clean up tokens
setInterval( () => {
	let directory	= '.data/tokens';

	fs.readdir( directory, {}, ( err, data ) =>{
		if ( ! err )
		{
			for ( let index in data )
			{
				let file		= data[index];
				let filename	= directory + '/' + file;
				if ( filename.match( /Readme.md/ ) !== null )
				{
					continue;
				}

				fs.readFile( filename, {}, ( err, data ) => {
					try
					{
						let fileData	= JSON.parse( data.toString( 'ascii' ) );
						if ( fileData.expires <= Date.now() )
						{
							fs.unlink( filename, ( err ) =>{
								if ( err )
								{
									console.log( err );
								}
							});
						}
					}
					catch ( e )
					{
						console.log( 'Could not parse file' );
					}
				});
			}
		}
	});
}, 2 * 1000 );
