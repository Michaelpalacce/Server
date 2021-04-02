'use strict';

/**
 * @brief	Safe array accessing
 *
 * @param	{Function} fn
 * @param	{*} defaultVal
 *
 * @return	{*}
 */
export function access( fn, defaultVal )
{
	try
	{
		const result	= fn()

		return result ? result : defaultVal;
	}
	catch ( e )
	{
		return defaultVal;
	}
}
