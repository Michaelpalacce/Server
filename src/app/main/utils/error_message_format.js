/**
 * @brief	Formats the error message
 *
 * @param	{Object} error
 *
 * @return	{String}
 */
export default function formatErrorMessage( error )
{
	return `An error has occurred: Code: ${error.code}${error.message ? `, message: ${error.message}` : ''}`
}
