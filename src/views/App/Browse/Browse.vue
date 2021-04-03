<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5 mb-64" v-if="upload === false">
		<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">
			<MenuElement text="Refresh" @click="browse( currentDirectory )"/>
			<MenuElement text="Upload" @click="showUpload"/>
			<div class="border-l-2 inline mx-2"></div>
			<MenuElement text="Rename"/>
			<MenuElement text="Download"/>
			<MenuElement text="Delete"/>
			<MenuElement text="Copy"/>
			<MenuElement text="Move"/>
		</div>
		<BrowseItem name="Back" :isFolder="true" @click="browse( previousDirectory )" :isBack="true"/>

		<div v-for="item in items">
			<BrowseItem
				:key="item.name + Math.random()"
				:name="item.name"
				:isFolder="item.isDir"
				:type="item.fileType"
				:encodedURI="item.encodedURI"
				:size="item.size"
				@click="onItemClick( item )"
			/>
		</div>
	</div>
	<div class="rounded-t-lg m-5 mx-auto btext-gray-200 px-5 mb-64" v-else>
		<BrowseItem name="Back" :isFolder="true" @click="upload = ! canBrowse" :isBack="true" class="mb-5"/>

		<form :action="apiUrl + '/file'" class="dropzone mb-5" method="POST" >
			<input type="hidden" name="directory" id="upload-file" :value="currentDirectory">
		</form>
	</div>
</template>

<script>
import BrowseItem			from "@/views/App/Browse/Components/BrowseItem";
import MenuElement			from "@/views/App/Browse/Components/MenuElement";
import communicator			from "@/app/main/api/communicator";
import { encode, decode }	from '@/../api/main/utils/base_64_encoder';
import Dropzone				from '@/app/lib/dropzone';


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

			loading				: false,
			upload				: false,
			apiUrl				: communicator.getApiUrl(),
			dropzone			: null,
			canBrowse			: true
		};
	},

	/**
	 * @brief	Loads initial data and adds an onscroll event
	 *
	 * @details	The initial data will be loaded according to the directory query param
	 * 			The on scroll event will attempt to load more data if the user scrolls close to the bottom of the page
	 */
	async mounted()
	{
		// Load the page
		await this.browse( this.$route.query.directory || '' );

		window.onscroll			= this.tryToLoad
		Dropzone.autoDiscover	= false;
	},

	/**
	 * @brief	Remove the onscroll event
	 *
	 * @return	void
	 */
	unmounted()
	{
		window.onscroll	= null;
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

			this.items		= newItems;
			this.loading	= false;
		},

		/**
		 * @brief	Sets the Url to the currently set currentDirectory
		 *
		 * @return	void
		 */
		setUrlToCurrentDirectory()
		{
			this.$router.push( { path: 'browse', query: { directory: this.currentDirectory } } );
		},

		/**
		 * @brief	Shows the upload part of the browse
		 *
		 * @return	void
		 */
		showUpload()
		{
			this.upload	= true;

			setTimeout( ()=>{
				this.dropzone	= new Dropzone(
					'.dropzone',
					{
						url: `${this.apiUrl}/file`,
						method: 'post',
						parallelUploads: 5,
						maxFilesize: 40000,
						timeout:0,
						headers: communicator.getAuthHeaders()
					}
				);

				if ( this.dropzone !== null )
				{
					this.dropzone.on( 'addedfile', () => { this.canBrowse	= false; } );
					this.dropzone.on( 'queuecomplete', () => { this.canBrowse	= true; } );

					this.dropzone.on( 'success', async( file ) => {
						const decodedCurrentDir	= decode( this.currentDirectory );

						const item	= await communicator.getFileData( encode( `${decodedCurrentDir}/${file.name}` ) ).catch( ( error ) => {
							console.log( error );

							return null;
						} );

						if ( item === null )
							return;

						item.key	= item.name;
						this.items	= this.items.concat( [item] );

						setTimeout(() => {
							this.dropzone.removeFile( file );
						}, 2000 );
					});

					this.dropzone.on( 'error', ( file, error ) => {
						alert( error );
					});
				}
			});
		}
	}
}
</script>

<style scoped>
</style>