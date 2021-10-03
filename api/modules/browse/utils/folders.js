const path				= require( 'path' );
const PATH_SEPARATOR_OS	= path.sep;

function formatFolder( folder ) {
	return `${path.resolve( folder )}${PATH_SEPARATOR_OS}`.replace( `${PATH_SEPARATOR_OS}${PATH_SEPARATOR_OS}`, PATH_SEPARATOR_OS)
}

module.exports	= {
	/**
	 * Check if the given item is in the folder or are the same
	 * If isItemAFolder is set to true then the item will have a path separator added
	 *
	 * @param	{String} item
	 * @param	{String} folder
	 * @param	{Boolean} isItemAFolder
	 *
	 * @return	{Boolean}
	 */
	itemInFolder( item, folder, isItemAFolder = false ) {
		console.log( `Item: ${item}` );
		console.log( `folder: ${folder}` );
		if ( item === folder ) {
			return true;
		}

		const resolvedItem		= isItemAFolder ? formatFolder( item ) : path.resolve( item );
		const resolvedFolder	= formatFolder( folder );

		console.log( `ResolvedItem: ${resolvedItem}` );
		console.log( `ResolvedFolder: ${resolvedFolder}` );

		return resolvedItem.startsWith( resolvedFolder );
	}
}