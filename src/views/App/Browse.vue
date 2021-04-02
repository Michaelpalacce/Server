<template>
	<div class="rounded-t-lg m-5 mx-auto bg-gray-700 text-gray-200 px-5">
		<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">
			<div class="px-4 py-3 inline-block">Rename</div>
			<div class="px-4 py-3 inline-block">Download</div>
			<div class="px-4 py-3 inline-block">Delete</div>
			<div class="px-4 py-3 inline-block">Copy</div>
			<div class="px-4 py-3 inline-block">Move</div>
		</div>

		<div v-for="item in items">
			<BrowseItem :name="item.name" :isFolder="item.isDir"/>
		</div>
	</div>
</template>

<script>
import BrowseItem	from "@/views/App/Components/Browse/BrowseItem";
import communicator	from "@/app/main/api/communicator";

export default {
	name: 'Browse',
	components: {
		BrowseItem
	},

	data: () => {
		return {
			items				: [],
			nextToken			: '',
			hasMore				: true,
			currentDirectory	: '',
		};
	},

	async created()
	{
		// Load the page
		await this.browse();
	},

	methods	: {
		/**
		 * @brief	Browses the given directory with the given token
		 *
		 * @details	The token is used for pagination and is retrieved from the API
		 *
		 * @return	Promise{<void>}
		 */
		browse	: async function( directory = '/' )
		{
			const browseResult	= await communicator.browse( directory, this.token );

			this.items				= browseResult.items;
			this.token				= browseResult.nextToken;
			this.currentDirectory	= browseResult.currentDirectory;
			this.hasMore			= browseResult.hasMore;

			this.setUrlToCurrentDirectory();
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