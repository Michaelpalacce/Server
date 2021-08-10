'use strict';


// Dependencies
const app				= require( 'event_request' )();
const router			= app.Router();
const NewFavoriteInput	= require( '../input/new_favorite_input' );

/**
 * @brief	Adds a '/api/browse/favorite' route with method POST
 *
 * @details	Required Parameters: item
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/file/favorite', async ( event ) => {
	const input	= new NewFavoriteInput( event );
	event.$user.getDashboardMetadata().addBrowseFavorite( input.getItem() );

	event.send();
});

/**
 * @brief	Adds a '/api/browse/favorite/:id:' route with method DELETE
 *
 * @details	Required Parameters: item
 * 			Optional Parameters: NONE
 *
 * @return	void
 */
router.post( '/browse/file/favorite', async ( event ) => {
	const input	= new DeleteFavoriteInput( event );
	event.$user.getDashboardMetadata().addBrowseFavorite( input.getItem() );

	event.send();
});

module.exports	= router;