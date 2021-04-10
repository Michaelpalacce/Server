'use strict';

/**
 * @brief	Exports functions used to parse and format the permissions so they can be stored in the dataStore as a String
 */
module.exports	= {
	/**
	 * @brief	Parses the permissions by decoding the JSON
	 *
	 * @details	Further creates regex patterns if any were defined
	 *
	 * @param	{Object} permissions
	 *
	 * @return	Object
	 */
	parsePermissions: function ( permissions )
	{
		return typeof permissions !== 'string' ? permissions : JSON.parse( permissions, ( key, value ) => {
			if ( typeof value !== 'undefined' && typeof value.regexp !== 'undefined' )
				value	= new RegExp( value.regexp.source, value.regexp.flags );

			return value;
		});
	},

	/**
	 * @brief	Formats the permissions
	 *
	 * @param	{Object} permissions
	 *
	 * @return	Object
	 */
	formatPermissions: function( permissions )
	{
		return JSON.stringify( permissions, ( key, value ) => {
			if( value instanceof RegExp )
				return { regexp: { source: value.source, flags: value.flags } };
			else
				return value;
		});
	},



	/**
	 * @brief	Mixes 2 permissions and returns a new array
	 *
	 * @details	The values from the second permissions set will be after the ones in the first
	 *
	 * @param	{Object} first
	 * @param	{Object} second
	 *
	 * @return	{Object}
	 */
	mixPermissions: function ( first, second )
	{
		const result	= { ...first };

		for ( const [key, value] of Object.entries( second ) )
		{
			if ( ! Array.isArray( result[key] ) )
				result[key]	= [];

			result[key]	= [...result[key], ...value];
		}

		return result;
	}
}


