'use strict';

// Dependencies
const Input			= require( '../../main/validation/input' );
const path			= require( 'path' );
const fs			= require( 'fs' );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

/**
 * @brief	Validates that the provided request contains the correct data
 */
class MoveInput extends Input
{
	/**
	 * @brief	Retruns the new path
	 *
	 * @returns	String
	 */
	getNewPath()
	{
		return this.get( MoveInput.NEW_PATH_KEY );
	}

	/**
	 * @brief	Returns the old path
	 *
	 * @returns	String
	 */
	getOldPath()
	{
		return this.get( MoveInput.OLD_PATH_KEY );
	}

	/**
	 * @copydoc	Input::_validate
	 */
	_validate()
	{
		const isSU					= this.event.session.get( 'SU' );
		const route					= this.event.session.get( 'route' );

		let { newPath, oldPath }	= this.event.body;

		newPath						= Buffer.from( decodeURIComponent( newPath ), 'base64' ).toString();
		oldPath						= Buffer.from( decodeURIComponent( oldPath ), 'base64' ).toString();

		const resolvedNewPath		= path.resolve( newPath );
		const resolvedOldPath		= path.resolve( oldPath );
		const resolvedRoute			= path.resolve( route );

		if ( resolvedNewPath.includes( PROJECT_ROOT ) )
		{
			this.reason	= `Cannot do operations to project ROOT ${PROJECT_ROOT}`;
			return false;
		}

		if ( resolvedOldPath.includes( PROJECT_ROOT ) || PROJECT_ROOT.includes( resolvedOldPath ) )
		{
			this.reason	= `Cannot do operations to project ROOT ${PROJECT_ROOT}`;
			return false;
		}

		if ( ! isSU && ! resolvedOldPath.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to do operations on ${resolvedOldPath}`;
			return false;
		}

		if ( ! isSU && ! resolvedNewPath.includes( resolvedRoute ) )
		{
			this.reason	= `No permissions to do operations on ${resolvedNewPath}`;
			return false;
		}

		if ( fs.statSync( oldPath ).isDirectory() )
		{
			this.reason	= `Cannot do operations on a directory: ${oldPath}`;
			return false;
		}

		this.model[MoveInput.NEW_PATH_KEY]	= newPath;
		this.model[MoveInput.OLD_PATH_KEY]	= oldPath;

		return true;
	}
}

MoveInput.NEW_PATH_KEY	= 'newPath';
MoveInput.OLD_PATH_KEY	= 'oldPath';

module.exports	= MoveInput;