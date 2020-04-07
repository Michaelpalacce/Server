'use strict';

// Dependencies
const { opendir, stat }	= require( 'fs' ).promises;
const { join }			= require( 'path' );

const DEFAULT_LIMIT		= 50;

/**
 * @brief	Class that helps us paginate browsing through the file system
 */
class FileSystem
{
	/**
	 * @brief	Gets a token in a correct format
	 *
	 * @param	token mixed
	 *
	 * @returns	Object
	 */
	sanitizeToken( token )
	{
		if ( typeof token === 'string' )
		{
			if ( token === '' )
			{
				return { position: 0, hasMore: true, finishedDirectories: false, finishedFiles: false };
			}

			return JSON.parse( token );
		}

		return token;
	}

	/**
	 * @brief	Gets both directories and files, with the directories being first
	 *
	 * @return	Promise
	 */
	async getAllItems( directory, token = '', limit = DEFAULT_LIMIT )
	{
		let adjustableLimit	= limit;
		let nextToken		= this.sanitizeToken( token );
		let items			= [];

		if ( nextToken.finishedDirectories === false )
		{
			const response	= await this.getDirectories( directory, nextToken, adjustableLimit ).catch( this.handleError );

			adjustableLimit	-= response.items.length;
			nextToken		= response.nextToken;
			items			= [...items, ...response.items];

			if ( items.length <= limit || limit === 0 )
			{
				nextToken.hasMore	= true;
			}
		}

		if ( nextToken.finishedDirectories === true && nextToken.finishedFiles === false )
		{
			const response	= await this.getFiles( directory, nextToken, adjustableLimit ).catch( this.handleError );

			nextToken		= response.nextToken;
			items			= [...items, ...response.items];
		}

		return {
			items,
			nextToken,
			hasMore	: nextToken.hasMore
		}
	}

	/**
	 * @brief	Gets the directories with pagination
	 *
	 * @param	directory String
	 * @param	token mixed
	 * @param	limit Number
	 *
	 * @return	Promise
	 */
	async getDirectories( directory, token = '', limit = DEFAULT_LIMIT )
	{
		const directoriesResponse	= await this.getItems( directory, token, limit, true );

		if ( directoriesResponse.hasMore === false )
		{
			directoriesResponse.nextToken.finishedDirectories	= true;
			directoriesResponse.nextToken.position				= 0;
		}

		return directoriesResponse;
	}

	/**
	 * @brief	Gets the files with pagination
	 *
	 * @param	directory String
	 * @param	token mixed
	 * @param	limit Number
	 *
	 * @return	Promise
	 */
	async getFiles( directory, token = '', limit = DEFAULT_LIMIT )
	{
		const filesResponse	= await this.getItems( directory, token, limit, false );

		if ( filesResponse.hasMore === false )
		{
			filesResponse.nextToken.finishedFiles	= true;
			filesResponse.nextToken.position		= 0;
		}

		return filesResponse;
	}

	/**
	 * @brief	Gets either folders or items according to a token
	 *
	 * @param	directory String
	 * @param	token mixed
	 * @param	limit Number
	 * @param	isDir Boolean
	 *
	 * @return	Promise
	 */
	async getItems( directory, token = '', limit = DEFAULT_LIMIT, isDir )
	{
		token						= this.sanitizeToken( token );
		let { position, hasMore }	= token;

		// Don't do anything, old token was EOD
		if ( hasMore === false )
		{
			return {
				nextToken	: token,
				items		: [],
				hasMore		: false
			};
		}

		let items	= [];
		let count	= 0;
		hasMore		= false;

		const dir	= await opendir( directory );
		for await ( const item of dir )
		{
			// If we've reached the limit break
			if ( items.length === limit && limit !== 0 )
			{
				hasMore	= true;
				break;
			}

			const absItemName	= join( directory, item.name );

			// Ignore ones we don't have permissions for
			try
			{
				const stats	= await stat( absItemName ).catch(()=>{});

				if ( stats.isDirectory() === isDir )
				{
					count ++;
					// Skip to a higher position
					if ( count <= position )
					{
						continue;
					}

					// Add items
					items.push( absItemName );
				}
			}
			catch ( error )
			{
				continue;
			}
		}

		token.position	= items.length + position;
		token.hasMore	= hasMore;

		return {
			nextToken: token,
			items,
			hasMore
		};
	}

	/**
	 * @brief	Handles errors in promises
	 *
	 * @param	error error
	 *
	 * @return	void
	 */
	handleError( error )
	{
		setImmediate(()=>{
			throw error;
		});
	}
}

module.exports	= FileSystem;
