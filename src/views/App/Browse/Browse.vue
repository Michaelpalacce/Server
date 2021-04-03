<template>
	<div class="rounded-t-lg m-5 mx-auto bg-gray-700 text-gray-200 px-5 mb-64">
		<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">
			<MenuElement text="Refresh" @click="browse( currentDirectory )"/>
			<div class="border-l-2 inline"></div>
			<MenuElement text="Rename"/>
			<MenuElement text="Download"/>
			<MenuElement text="Delete"/>
			<MenuElement text="Copy"/>
			<MenuElement text="Move"/>
		</div>
		<BrowseItem name="Back" :isFolder="true" @click="browse( previousDirectory )" :isBack="true"/>

		<div v-for="item in items">
			<BrowseItem :name="item.name" :isFolder="item.isDir" :type="item.fileType" :encodedURI="item.encodedURI" @click="onItemClick( item )" />
		</div>
	</div>
</template>

<script>
import BrowseItem	from "@/views/App/Browse/Components/BrowseItem";
import MenuElement	from "@/views/App/Browse/Components/MenuElement";
import communicator	from "@/app/main/api/communicator";

export default {
	name: 'Browse',
	components: {
		BrowseItem, MenuElement
	},

	data: () => {
		return {
			items				: [],
			nextToken			: '',
			hasMore				: true,
			currentDirectory	: '',
			previousDirectory	: '',
			loading				: false
		};
	},

	async created()
	{
		// Load the page
		await this.browse( this.$route.query.directory || '' );

		window.onscroll	= this.tryToLoad
	},

	methods	: {
		/**
		 * @brief	Triggered when an item is clicked
		 *
		 * @details	This will only trigger the browse function if the item is a folder, otherwise the item will be previewed
		 *
		 * @return	void
		 */
		onItemClick( item )
		{
			if ( item.isDir )
				this.browse( item.encodedURI );
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
		},

		/**
		 * @brief	Tries to load the page if the bottom of the page is reached
		 */
		async tryToLoad()
		{
			if ( ! this.hasMore )
				return false;

			const offset			= 500;
			const yOffset			= Math.max( window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop );
			const bottomOfWindow	= yOffset + window.innerHeight + offset >= document.documentElement.offsetHeight;

			if ( bottomOfWindow )
				await this.browse( this.currentDirectory, this.nextToken );
		},

		/**
		 * @brief	Browses the given directory with the given token
		 *
		 * @details	The token is used for pagination and is retrieved from the API
		 * 			This method has a flag for loading set so it will not attempt to load anything if there is already
		 * 				a request being processed.
		 * 			The items when loading a new dir are displayed after completely removing the old ones ( via a setTimeout )
		 * 				for some reason Vue does not clear the old data and it stays in the new elements, so the items are
		 * 				first fully cleared and then set
		 *
		 * @return	Promise{<void>}
		 */
		browse	: async function( directory = '', token = '' )
		{
			if ( this.loading )
				return;

			this.loading	= true;

			const browseResult	= await communicator.browse( directory, token ).catch( ( error ) => {
				return null;
			});

			if ( ! browseResult )
				return console.log( 'There was an error loading data' );

			const isNewDir			= token === '';
			const newItems			= isNewDir ? browseResult.items : this.items.concat( browseResult.items );

			this.previousDirectory	= browseResult.previousDirectory;
			this.currentDirectory	= browseResult.currentDirectory;
			this.nextToken			= browseResult.nextToken;
			this.hasMore			= browseResult.hasMore;

			this.setUrlToCurrentDirectory();

			if ( isNewDir )
			{
				this.items	= [];
				setTimeout(() => {
					this.items		= newItems;
					this.loading	= false;
				});
			}
			else
			{
				this.items		= newItems;
				this.loading	= false;
			}
		},

		/**
		 * @brief	Sets the Url to the currently set currentDirectory
		 *
		 * @return	void
		 */
		setUrlToCurrentDirectory()
		{
			this.$router.push( { path: 'browse', query: { directory: this.currentDirectory } } );
		}
	}
}
</script>

<style scoped>
</style>