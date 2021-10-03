'use strict';

const { stat }			= require( 'fs' ).promises;

const formatItem		= require( '../../../../main/utils/file_formatter' );
const forbiddenDirs		= require( '../../utils/forbidden_folders' );
const { itemInFolder }	= require( '../../utils/folders' );

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

	async hasPermissions( itemName ) {
		const route		= this.user.getBrowseMetadata().getRoute()
		const stats		= await stat( itemName ).catch( () => { return { code: 'app.browse.file.fileDoesNotExist' } } );

		if ( stats.code )
			throw stats;

		for ( const forbiddenDir of forbiddenDirs )
			if ( ! itemInFolder( itemName, route ) || itemInFolder( itemName, forbiddenDir ) )
				throw { code: 'app.browse.fileData.unauthorized', message : `No permissions to access ${itemName}`, status: 403 };
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
		if ( ! fileInput.isValid() )
			throw { code: 'app.input.invalidFileInput', message : fileInput.getReasonToString() };

		const itemName	= fileInput.getFile();

		await this.hasPermissions( itemName );

		return formatItem( itemName, this.event );
	}

	/**
	 * Streams a file
	 *
	 * @param	{FileInput} fileInput
	 *
	 * @return	{Promise<void>}
	 */
	async streamFile( fileInput ) {
		if ( ! fileInput.isValid() )
			throw { code: 'app.input.invalidFileInput', message : fileInput.getReasonToString() };

		const itemName	= fileInput.getFile();

		await this.hasPermissions( itemName );

		this.event.getFileStream( itemName ).pipe( this.event.response );
	}
}

module.exports	= FileModel;
