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
 *
 * @return	Object
 */
module.exports	= function formatItem( itemName, event )
{
	const stats				= statSync( itemName );
	const parsedItem		= parse( itemName );

	itemName				= parsedItem.base;
	const absItemName		= join( parsedItem.dir, parsedItem.base );
	const uriToEncode		= absItemName.replace( /\\/g, '/' );
	const encodedURI		= encodeURIComponent( Buffer.from( uriToEncode ).toString( 'base64' ) );
	const fileStreamer		= event.fileStreamHandler.getFileStreamerForType( absItemName );
	const previewAvailable	= fileStreamer !== null;
	const size				= stats.size;
	const isDir				= stats.isDirectory();
	const fileType			= isDir ? 'directory' : previewAvailable ? fileStreamer.getType() : null;

	return {
		name	: itemName,
		fileType,
		isDir,
		encodedURI,
		size,
		previewAvailable
	};
};
