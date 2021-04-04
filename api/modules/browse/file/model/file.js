'use strict';

const { stat }		= require( 'fs' ).promises;
const path			= require( 'path' );

const formatItem	= require( '../../../../main/utils/file_formatter' );
const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

class FileModel
{
	/**
	 * @param	{EventRequest} event
	 */
	constructor( event )
	{
		this.event	= event;
		this.user	= event.$user;
	}

	/**
	 * @brief	Gets information about the file given the input
	 *
	 * @param	{FileInput} fileInput
	 *
	 * @return	{Promise<Object>}
	 */
	async getFile( fileInput )
	{
		const route	= this.user.getBrowseMetadata().getRoute();

		if ( ! fileInput.isValid() )
			throw { code: 'app.input.invalidFileInput', message : fileInput.getReasonToString() };

		const itemName	= fileInput.getFile();
		const stats		= await stat( itemName ).catch( () => { return { code: 'app.browse.file.fileDoesNotExist' } } );

		if ( stats.code )
			throw stats;

		const resolvedFile	= path.resolve( itemName );
		const resolvedRoute	= path.resolve( route );

		if ( resolvedFile.includes( resolvedRoute ) || resolvedFile.includes( PROJECT_ROOT ) )
			throw { code: 'app.browse.fileData.unauthorized', message : `No permissions to access ${resolvedFile}`, status: 403 };

		return formatItem( itemName, this.event );
	}
}

module.exports	= FileModel;