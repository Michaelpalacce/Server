<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5 mb-64" v-if="upload === false">
<!--		<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">-->
<!--			<MenuElement key="Refresh" text="Refresh" @on-click="showUpload"/>-->
<!--			<MenuElement key="Upload" text="Upload" @on-click="browse( currentDirectory )"/>-->
<!--			<div class="border-l-2 inline mx-2"></div>-->
<!--			<MenuElement key="Rename" text="Rename" :isDisabled="renameDisabled" @on-click="$emit( 'rename-click' )"/>-->
<!--			<MenuElement key="Download" text="Download" :isDisabled="downloadDisabled" @on-click="$emit( 'download-click' )"/>-->
<!--			<MenuElement key="Delete" text="Delete" :isDisabled="deleteDisabled" @on-click="$emit( 'delete-click' )"/>-->
<!--			<MenuElement key="Copy" text="Copy" :isDisabled="copyDisabled" @on-click="$emit( 'copy-click' )"/>-->
<!--			<MenuElement key="Move" text="Move" :isDisabled="moveDisabled" @on-click="$emit( 'move-click' )"/>-->
<!--		</div>-->
<!--		-->
		<Menu
			:key="'Menu'"
			:renameDisabled="renameDisabled"
			:downloadDisabled="downloadDisabled"
			:deleteDisabled="deleteDisabled"
			:copyDisabled="copyDisabled"
			:moveDisabled="moveDisabled"
			@upload-click="showUpload"
			@refresh-click="browse( currentDirectory )"
		/>
		<BrowseItem :key="'Back'" name="Back" :isFolder="true" @click="browse( previousDirectory )" :isBack="true"/>

		<div v-for="item in items">
			<BrowseItem
				:key="item.name + Math.random()"
				:name="item.name"
				:isFolder="item.isDir"
				:fileType="item.fileType"
				:encodedURI="item.encodedURI"
				:previewAvailable="item.previewAvailable"
				:size="item.size"
				@on-click="onItemClick( item )"
				@on-checked="onItemChecked"
			/>
		</div>
	</div>
	<div class="rounded-t-lg m-5 mx-auto btext-gray-200 px-5 mb-64" v-else>
		<BrowseItem :key="'BackUpload'" name="Back" :isFolder="true" @click="upload = ! canBrowse" :isBack="true" class="mb-5"/>

		<form :action="apiUrl + '/file'" class="dropzone mb-5" method="POST" >
			<input type="hidden" name="directory" id="upload-file" :value="currentDirectory">
		</form>
	</div>
</template>

<script>
import BrowseItem			from "@/views/App/Browse/Components/BrowseItem";
import MenuElement			from "@/views/App/Browse/Components/MenuComponents/MenuElement";
import communicator			from "@/app/main/api/communicator";
import { encode, decode }	from '@/../api/main/utils/base_64_encoder';
import Dropzone				from '@/app/lib/dropzone';
import Menu					from "@/views/App/Browse/Components/Menu";


export default {
	name: 'Browse',
	components: { Menu, BrowseItem, MenuElement },

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
			canBrowse			: true,

			checkedItems		: [],

			renameDisabled		: false,
			downloadDisabled	: false,
			deleteDisabled		: false,
			copyDisabled		: false,
			moveDisabled		: false,
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
		 * @brief	Triggered when an item checkbox is clicked
		 *
		 * @details	This adds or removes the item from the buffer of checked items
		 *
		 * @return	void
		 */
		onItemChecked( checkedItem )
		{
			const item		= checkedItem.item;

			const key		= item.name;
			const isChecked	= checkedItem.checked;

			if ( isChecked )
				this.checkedItems	= this.checkedItems.concat( item );
			else
				this.checkedItems.splice( this.checkedItems.indexOf( checkedItem ), 1 );

			let foldersCount	= 0;
			let filesCount		= 0

			for ( const item of this.checkedItems )
			{
				item.isFolder ? foldersCount ++ : filesCount ++;
			}

			this.setMenu( foldersCount, filesCount );

			console.log( `Folders: ${foldersCount} and files: ${filesCount}` );
		},

		/**
		 * @brief	Resets the menu so all items are NOT disabled
		 *
		 * @return	void
		 */
		setMenu( foldersCount = 0, filesCount = 0 )
		{
			switch ( true )
			{
				// Either one folder or one file
				case ! foldersCount && filesCount === 1:
				case foldersCount === 1 && ! filesCount:
					console.log( 'One folder or one file' );
					this.renameDisabled		= false;
					this.downloadDisabled	= false;
					break;

				// Only folders ( more than one )
				case foldersCount !== 0 && ! filesCount:
					console.log( 'Only folders ( more than one )' );

					this.renameDisabled		= true;
					this.downloadDisabled	= false;
					break;

				// Only files ( more than one )
				case ! foldersCount && filesCount !== 0:
					console.log( 'Only files ( more than one )' );
					this.renameDisabled		= true;
					this.downloadDisabled	= false;
					break;

				// Folders and files
				case foldersCount !== 0 && filesCount !== 0:
					console.log( 'Folders and files' );
					this.renameDisabled		= true;
					this.downloadDisabled	= true;
					break;

				default:
					console.log( 'DEFAULT' );
					this.renameDisabled		= false;
					this.downloadDisabled	= false;
					break;
			}
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
			this.items				= isNewDir ? browseResult.items : this.items.concat( browseResult.items );
			this.previousDirectory	= browseResult.previousDirectory;
			this.currentDirectory	= browseResult.currentDirectory;
			this.nextToken			= browseResult.nextToken;
			this.hasMore			= browseResult.hasMore;

			if ( isNewDir )
			{
				this.checkedItems	= [];
				this.setMenu();
			}

			this.setUrlToCurrentDirectory();

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
	},

	watch: {
		items: function ()
		{
			console.log( 'ITEMS HAVE BEEN CHANGED!?' );
		}
	}
}
</script>

<style scoped>
</style>