'use strict';

const { statSync }		= require( 'fs' );
const { parse, join }	= require( 'path' );

/**
 * @brief	Formats the item
 *
 * @details	EW legacy
 *
 * @param	{String} itemName
 * @param	{EventRequest} event
 * @param	{Boolean} [isBack=false]
 *
 * @return	Object
 */
module.exports	= function formatItem( itemName, event, isBack = false )
{
	const stats				= statSync( itemName );
	const parsedItem		= parse( itemName );

	const goBack			= isBack === true;
	itemName				= goBack ? parsedItem.dir : parsedItem.base;
	const absItemName		= ( goBack ? parsedItem.dir : join( parsedItem.dir, parsedItem.base ) );
	const uriToEncode		= absItemName.replace( '\\', '/' );
	const encodedURI		= encodeURIComponent( Buffer.from( uriToEncode ).toString( 'base64' ) );
	const fileStreamer		= event.fileStreamHandler.getFileStreamerForType( absItemName );
	const previewAvailable	= fileStreamer !== null;
	const size				= stats.size;
	const isDir				= stats.isDirectory();
	const fileType			= previewAvailable ? fileStreamer.getType() : isDir ? 'directory' : null;

	return {
		name	: goBack ? 'BACK' : itemName,
		fileType,
		isDir,
		encodedURI,
		size,
		previewAvailable
	};
};
