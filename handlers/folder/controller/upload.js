'use strict';

// Dependencies
const { Server }			= require( 'event_request' );
const fs					= require( 'fs' );
const app					= Server();

const FORBIDDEN_CHARACTERS	= [ '<', '>', ':', '|', '?', '*' ];

/**
 * @brief	Adds a '/folder' route with method PUT
 *
 * @details	Creates a new folder
 *
 * @details	Required Parameters: folder
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
app.post( '/folder', ( event ) => {
	const result	= event.validationHandler.validate( event.body, { folder : 'filled||string' } );

		if ( ! ! result.hasValidationFailed() )
		{
			event.next( 'Invalid folder given', 400 );
			return;
		}

		const folder	= decodeURIComponent( result.getValidationResult().folder );

		for ( const charIndex in FORBIDDEN_CHARACTERS )
		{
			const character	= FORBIDDEN_CHARACTERS[charIndex];
			if ( folder.includes( character ) )
			{
				event.sendError( 'Folder name contains invalid characters', 400 );
				return;
			}
		}

		if ( ! fs.existsSync( folder ) || folder === '/' )
		{
			try
			{
				fs.mkdirSync( folder );
				event.send( ['ok'], 201 );
			}
			catch ( e )
			{
				event.sendError( 'Could not create folder', 400 );
			}
		}
		else
		{
			event.sendError( 'Directory already exists', 400 );
		}
	}
);
