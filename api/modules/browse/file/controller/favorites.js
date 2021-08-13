'use strict';


// Dependencies
const app					= require( 'event_request' )();
const NewFavoriteInput		= require( '../input/new_favorite_input' );
const DeleteFavoriteInput	= require( '../input/delete_favorite_input' );
const router				= app.Router();

/**
 * @brief	Adds a '/api/browse/favorite' route with method POST that adds a new favorite
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
router.delete( '/browse/file/favorite/:id:', async ( event ) => {
	const input	= new DeleteFavoriteInput( event );
	event.$user.getDashboardMetadata().removeBrowseFavorite( input.getId() );

	event.send();
});

module.exports	= router;