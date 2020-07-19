'use strict';

// Dependencies
const Input			= require( '../../main/validation/input' );
const path			= require( 'path' );
const fs			= require( 'fs' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Validates that the provided request contains the correct data
 */
class DeleteInput extends Input
{
	/**
	 * @brief	Returns the directory
	 *
	 * @returns	mixed
	 */
	getDirectory()
	{
		return this.get( DeleteInput.DIRECTORY_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		if ( ! this.event.session.has( 'route' ) || ! this.event.session.has( 'SU' ) )
		{
			this.reason	= 'Missing session params';
			return false;
		}

		const isSU	= this.event.session.get( 'SU' );
		const route	= this.event.session.get( 'route' );

		this.reason	= this.validationHandler.validate( this.event.query, { item : 'optional||string' } );

		if ( this.reason.hasValidationFailed() )
			return false;

		let { item }		= this.reason.getValidationResult();
		item				= Buffer.from( decodeURIComponent( item ), 'base64' ).toString();

		const resolvedDir	= path.resolve( item );
		const resolvedRoute	= path.resolve( route );

		if ( resolvedDir.includes( PROJECT_ROOT ) || PROJECT_ROOT.includes( resolvedDir ) )
		{
			this.reason	= `Cannot delete project ROOT ${resolvedDir}`;
			return false;
		}

		if ( ! isSU && ! resolvedDir.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to delete ${resolvedDir}`;
			return false;
		}

		if ( item === '/' )
		{
			this.reason	= 'Cannot delete Root!';
			return false;
		}

		if ( ! fs.existsSync( item ) )
		{
			this.reason	= `Directory does not exist: ${resolvedDir}`;
			return false;
		}

		if ( ! fs.statSync( item ).isDirectory() )
		{
			this.reason	= `Trying to delete a file: ${resolvedDir}`;
			return false;
		}

		this.model[DeleteInput.DIRECTORY_KEY]	= item;

		return true;
	}
}

DeleteInput.DIRECTORY_KEY	= 'dir';

module.exports	= DeleteInput;