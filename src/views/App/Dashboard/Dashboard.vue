<template>
	<div class="mt-10 text-white text-center">
		<h1 class="text-5xl">Welcome {{name}}!</h1>
		<Divider />
	</div>

	<transition name="browse">
		<div class="mt-20" v-if="browseFavorites.length > 0">
			<p class="text-white cursor-pointer mx-auto text-center" @click="browseShown = !browseShown">
				<span class="inline-block text-2xl mb-5">Browse Favorites</span>
				<span class="inline-block ml-2 chevron"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg></span>
			</p>

			<transition name="browseItems" >
				<div class="lg:w-3/4 mx-auto w-full" v-if="browseShown && browseFavorites.length > 0" >
					<GeneralMenu
						:elements="menu"
						:isSticky="false"
						@refresh-click="loadBrowseFavorites"
						@remove-click="deleteBrowseFavorite"
					/>
					<BrowseItem
						class="mb-5 inline-block"

						v-for="item in browseFavorites"

						:key="item.name"
						:id="item.id"
						:initialName="item.name"
						:isFolder="item.isFolder"
						:fileType="item.fileType"
						:initialEncodedURI="item.encodedURI"
						:previewAvailable="item.previewAvailable"
						:size="item.size"
						@on-click="browseItemClick( item )"
						@on-checked="onItemChecked"
					/>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import communicator	from '../../../app/main/api/communicator';
import BrowseItem	from '../Browse/Components/BrowseItem';
import Button		from '../Components/Button';
import Divider		from '../Components/Divider';
import TitleSection	from '../Users/Components/TitleSection';
import GeneralMenu	from "@/views/App/Components/GeneralMenu";

export default {
	name		: 'Dashboard',
	components	: { GeneralMenu, Divider, BrowseItem, Button, TitleSection },
	data		: () => {
		const refreshMenuEl	= {
			text		: 'fas fa-sync',
			eventName	: 'refresh-click',
			iconTitle	: 'Refresh',
			shown		: true,
			isIcon		: true,
			isDisabled	: false
		};

		const deleteMenuEl	= {
			text		: 'fas fa-trash',
			eventName	: 'remove-click',
			iconTitle	: 'Delete',
			shown		: true,
			isIcon		: true,
			isDisabled	: true
		};

		return {
			name			: localStorage.name,
			browseShown		: true,
			browseFavorites	: [],
			refreshMenuEl,
			deleteMenuEl,
			menu			: [
				refreshMenuEl, deleteMenuEl
			],
			checkedItems	: []
		};
	},

	async created()
	{
		this.loadBrowseFavorites();
	},

	methods: {
		/**
		 * @brief	Sets the menu according to the current checked items
		 *
		 * @return	void
		 */
		setMenu()
		{
			let foldersCount	= 0;
			let filesCount		= 0

			for ( const item of this.checkedItems )
				item.isFolder ? foldersCount ++ : filesCount ++;

			switch ( true )
			{
				// nothing selected
				case ! foldersCount && ! filesCount:
					this.deleteMenuEl.isDisabled	= true;

					break;
				// Either one folder or one file
				case ! foldersCount && filesCount === 1:
				case foldersCount === 1 && ! filesCount:
					this.deleteMenuEl.isDisabled	= false;
					break;

				// Only folders ( more than one )
				case foldersCount !== 0 && ! filesCount:
					this.deleteMenuEl.isDisabled	= true;
					break;

				// Only files ( more than one )
				case ! foldersCount && filesCount !== 0:
					this.deleteMenuEl.isDisabled	= true;
					break;

				// Folders and files
				case foldersCount !== 0 && filesCount !== 0:
					this.deleteMenuEl.isDisabled	= true;
					break;

				default:
					this.deleteMenuEl.isDisabled	= false;
					break;
			}
		},

		/**
		 * @brief	Loads the browse favorites
		 *
		 * @return	{Promise<void>}
		 */
		async loadBrowseFavorites()
		{
			this.uncheckItems();
			const getDashboardResponse	= await communicator.getDashboard().catch( error => error );

			if ( getDashboardResponse.error )
				return;

			this.browseFavorites	= getDashboardResponse.browseFavorites;
		},

		/**
		 * @brief	Deletes a browse favorite link
		 *
		 * @return	void
		 */
		async deleteBrowseFavorite()
		{
			const itemId							= this.checkedItems[0].id;
			const deleteDashboardFavoriteResponse	= await communicator.deleteFavoriteBrowseItem( itemId ).catch( error => error );

			if ( deleteDashboardFavoriteResponse.error )
				return;

			await this.loadBrowseFavorites();
		},

		/**
		 * @brief	Triggered when an item checkbox is clicked
		 *
		 * @details	This adds or removes the item from the buffer of checked items
		 *
		 * @param	{Object} checkedItem
		 *
		 * @return	void
		 */
		onItemChecked( checkedItem )
		{
			const item		= checkedItem.item;
			const isChecked	= checkedItem.checked;

			if ( isChecked )
				this.checkedItems	= this.checkedItems.concat( item );
			else
				this.checkedItems	= this.checkedItems.filter( checkedItem => checkedItem.name !== item.name );
		},

		/**
		 * @brief	Uncheck all the items set in the checked items array
		 *
		 * @return	void
		 */
		uncheckItems()
		{
			for ( const item of this.checkedItems )
				item.checked	= false;

			this.checkedItems		= [];
		},

		/**
		 * @brief	Browses to a folder, or previews a file
		 *
		 * @return	void
		 */
		browseItemClick( item )
		{
			if ( item.isFolder )
				this.$router.push(
					{
						path	: 'browse',
						query	: {
							directory	: item.encodedURI
						}
					}
				);
			else if ( item.previewAvailable )
				this.$router.push(
					{
						path	: 'preview',
						query	: {
							item	: item.encodedURI,
							type	: item.fileType,
							name	: encodeURIComponent( item.name )
						}
					}
				);
		}
	},

	watch: {
		/**
		 * @brief	Sets the menu on every checked items change
		 *
		 * @return	void
		 */
		checkedItems: function ()
		{
			this.setMenu();
		}
	}
}
</script>

<style scoped>
.browseItems-enter-active,
.browseItems-leave-active {
	transition: opacity .25s ease;
}

.browseItems-enter-from,
.browseItems-leave-to {
	opacity: 0;
}

.browse-enter-active,
.browse-leave-active {
	transition: opacity .25s ease;
}

.browse-enter-from,
.browse-leave-to {
	opacity: 0;
}
</style>