'use strict';

//Dependencies
const fs		= require( 'fs' );
const path		= require( 'path' );

let model	= {};

/**
 * @brief	Handles the GET on /
 *
 * @details	The callback will be called in case of an error or when the required data has been performed
 *
 * @param	RequestEvent event
 * @param	Function callback
 *
 * @return	void
 */
model.get	= ( event, callback ) => {
	let startDir	= '/';
	fs.readdir( startDir, {}, ( error,  data ) => {
		if ( ! error && data && data.length > 0 )
		{
			let items	= [];

			for ( let i = 0; i < data.length; ++ i )
			{
				items.push( startDir + data[i] );
			}

			callback( false, { data: items } );
		}
		else
		{
			callback( true );
		}
	});
};

module.exports	= model;