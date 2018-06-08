'use strict';

// Dependencies
const Server	= require( 'event_request' );
const fs		= require( 'fs' );
const path		= require( 'path' );

let router		= new Server.Router();

/**
 * @brief	Adds a '/upload' route with method POST
 *
 * @details	Saves the file async
 *
 * @details	Required Parameters: file
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.add({
	route	: '/upload',
	method	: 'POST',
	handler	: ( event ) => {
		let directory	= '/';
		let found		= false;

		for ( let index in event.body )
		{
			let part	= event.body[index];

			if ( part.type === 'parameter' && part.name === 'directory' )
			{
				directory	= part.data.toString();
				break;
			}
		}

		for ( let index in event.body )
		{
			let part	= event.body[index];
			if ( part.type === 'file' )
			{
				let oldPath	= part.filePath;
				let newPath	= path.join( directory, part.name );
				fs.rename( oldPath, newPath, () =>{
					event.redirect( '/browse?dir=' + encodeURIComponent( directory ) );
				});
				found	= true;
			}
		}

		if ( ! found )
		{
			event.sendError( 'Could not upload file', 500 );
		}
	}
});

// Export the module
module.exports	= router;
