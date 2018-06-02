'use strict';

/**
 * @brief	Base File Stream extended by other file streams
 */
class FileStream
{
	constructor( event )
	{
		this.event				= event;
		this.SUPPORTED_FORMATS	= [];
	}

	/**
	 * @brief	Check whether the given file is supported by the file stream
	 *
	 * @param	String file
	 *
	 * @return	Boolean
	 */
	support( file )
	{
		console.log( 'NOT IMPLEMENTED' );
		return false;
	}

	/**
	 * @brief	Stream the file
	 *
	 * @param	String file
	 *
	 * @return	void
	 */
	stream( file )
	{
		return ;
	}
}

module.exports  = FileStream;
