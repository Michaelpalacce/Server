'use strict';

// Dependencies
const { existsSync }				= require( 'fs' );
const { mkdir, copyFile, opendir }	= require( 'fs' ).promises;
const { join }						= require( 'path' );

/**
 * @brief	Throw on any error
 *
 * @param	err Error
 */
function handleError( err )
{
	setImmediate(()=>{
		throw err;
	})
}

/**
 * @brief	Copies the entire folder from one destination to another
 *
 * @param	from String
 * @param	to String
 *
 * @return	Promise<void>
 */
module.exports	= async function copyFolder( from, to )
{
	if ( ! existsSync( to ) )
		await mkdir( to ).catch( handleError );

	const dir	= await opendir( from ).catch( handleError );
	for await ( const element of dir )
	{
		const itemName		= element.name;
		const origin		= join( from, itemName );
		const destination	= join( to, itemName );

		if ( element.isFile() )
		{
			await copyFile( origin, destination ).catch( handleError );
		}
		else
		{
			await copyFolder( origin, destination ).catch( handleError );
		}
	}
};
