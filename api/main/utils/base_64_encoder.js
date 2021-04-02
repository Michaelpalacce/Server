/**
 * @brief	Helper functions to base64 encode and decode the directories
 */
module.exports	= {
	/**
	 * @brief	base64 encodes the given string
	 *
	 * @param	{String} toEncode
	 *
	 * @return	{String}
	 */
	encode	: ( toEncode ) => {
		return encodeURIComponent( Buffer.from( toEncode ).toString( 'base64' ) )
	},

	/**
	 * @brief	base64 decodes the given string
	 *
	 * @param	{String} toDecode
	 *
	 * @return	{String}
	 */
	decode	: ( toDecode ) => {
		return Buffer.from( decodeURIComponent( toDecode ), 'base64' ).toString();
	}
};
