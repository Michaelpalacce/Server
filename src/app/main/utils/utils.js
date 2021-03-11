'use strict';

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
