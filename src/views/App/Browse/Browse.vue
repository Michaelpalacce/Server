<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5 mb-64" v-if="upload === false">
		<Menu
			key="Menu"
			:renameDisabled="renameDisabled"
			:downloadDisabled="downloadDisabled"
			:deleteDisabled="deleteDisabled"
			:copyDisabled="copyDisabled"
			:moveDisabled="moveDisabled"
			@upload-click="showUpload"
			@refresh-click="browse( currentDirectory )"
			@delete-click="deleteCheckedItems"
			@new-folder-click="createNewFolder"
			@rename-click="onRenameClick"
		/>
		<div class="my-2 mx-auto justify-center text-center text-xl font-medium tracking-wide">{{decodedCurrentDir}}</div>
		<BrowseItem key="BrowseBack" initialName="BrowseBack" :isFolder="true" @click="browse( previousDirectory )" :isBack="true"/>

		<Error :errorMessage="browseErrorMessage" class="mx-auto w-4/5 my-5"/>

		<div v-for="item in items">
			<BrowseItem
				:key="item.name"
				:initialName="item.name"
				:isFolder="item.isDir"
				:fileType="item.fileType"
				:initialEncodedURI="item.encodedURI"
				:previewAvailable="item.previewAvailable"
				:size="item.size"
				@on-click="onItemClick( item )"
				@on-checked="onItemChecked"
			/>
		</div>
	</div>
	<div class="rounded-t-lg m-5 mx-auto btext-gray-200 px-5 mb-64" v-else>
		<BrowseItem key="BackUpload" initialName="BackUpload" :isFolder="true" @click="upload = ! canBrowse; uploadErrorMessage = ''" :isBack="true" class="mb-5"/>
		<Error :errorMessage="uploadErrorMessage" class="mx-auto w-4/5 mb-5"/>

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
import Error				from "@/views/App/Browse/Components/Error";

export default {
	name: 'Browse',
	components: { Error, Menu, BrowseItem, MenuElement },

	data: () => {
		return {
			items				: [],
			nextToken			: '',
			hasMore				: true,
			currentDirectory	: '',
			decodedCurrentDir	: '',
			previousDirectory	: '',
			browseErrorMessage	: '',

			loading				: false,
			upload				: false,
			uploadErrorMessage	: '',
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
		 * @brief	Creates a new folder and adds it to the view
		 *
		 * @todo	Make a better way to create folders than a prompt!
		 *
		 * @return	void
		 */
		async createNewFolder()
		{
			const folderName	= prompt( 'What should the folder be called?' );

			if ( typeof folderName === 'string' && folderName.length > 0 )
			{
				const newPath				= encode( `${this.decodedCurrentDir}/${folderName}` );
				const createFolderResponse	= await communicator.createFolder( newPath ).catch( ( error ) => {
					return error;
				});

				if ( createFolderResponse.error )
					return this.browseErrorMessage	= this.formatErrorMessage( createFolderResponse.error );

				this.browse( this.currentDirectory );
			}
		},

		/**
		 * @brief	Rename the item and set reset the checked items
		 *
		 * @return	void
		 */
		async onRenameClick()
		{
			const item			= this.checkedItems[0];
			const newItemName	= prompt( 'New item name:', item.name );

			if ( typeof newItemName !== 'string' )
				return;

			const encodedNewName	= encode( `${this.decodedCurrentDir}/${newItemName}` );
			const response			= await communicator.renameItem( item, encodedNewName ).catch(( error ) => {
				return error;
			});

			if ( response.error )
				return this.browseErrorMessage	= this.formatErrorMessage( response.error );

			// @TODO RESET THE PREVIEW
			// Change item data
			item.name			= newItemName;
			item.encodedURI		= encodedNewName;
			item.checked		= false;

			this.checkedItems	= [];
			this.setMenu();
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
			const isChecked	= checkedItem.checked;

			if ( isChecked )
				this.checkedItems	= this.checkedItems.concat( item );
			else
				this.checkedItems.splice( this.checkedItems.indexOf( checkedItem ), 1 );

			this.setMenu();
		},

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
				// Either one folder or one file
				case ! foldersCount && filesCount === 1:
				case foldersCount === 1 && ! filesCount:
					this.renameDisabled		= false;
					this.downloadDisabled	= false;
					break;

				// Only folders ( more than one )
				case foldersCount !== 0 && ! filesCount:
					this.renameDisabled		= true;
					this.downloadDisabled	= false;
					break;

				// Only files ( more than one )
				case ! foldersCount && filesCount !== 0:
					this.renameDisabled		= true;
					this.downloadDisabled	= false;
					break;

				// Folders and files
				case foldersCount !== 0 && filesCount !== 0:
					this.renameDisabled		= true;
					this.downloadDisabled	= true;
					break;

				default:
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
		 * 			In the case of a newDirectory, items will be set directly, otherwise they will be concatenated. Also
		 * 				the checkedItems will be reset and all items set in there will be unchecked
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

			const browseResponse	= await communicator.browse( directory, token ).catch( ( error ) => {
				return error;
			});

			if ( browseResponse.error )
				return this.browseErrorMessage	= this.formatErrorMessage( browseResponse.error );

			const isNewDir			= token === '';
			this.items				= isNewDir ? browseResponse.items : this.items.concat( browseResponse.items );
			this.previousDirectory	= browseResponse.previousDirectory;
			this.currentDirectory	= browseResponse.currentDirectory;
			this.decodedCurrentDir	= decode( browseResponse.currentDirectory );
			this.nextToken			= browseResponse.nextToken;
			this.hasMore			= browseResponse.hasMore;

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
						const item	= await communicator.getFileData( encode( `${this.decodedCurrentDir}/${file.name}` ) ).catch( ( error ) => {
							return error;
						});

						if ( item.error )
							return this.uploadErrorMessage	= this.formatErrorMessage( item.error );

						item.key	= item.name;
						this.items	= this.items.concat( [item] );

						setTimeout(() => {
							this.dropzone.removeFile( file );
						}, 2000 );
					});

					this.dropzone.on( 'error', ( file, error ) => {
						error	= JSON.parse( error );
						this.uploadErrorMessage	= this.formatErrorMessage( error.error )
					});
				}
			});
		},

		/**
		 * @brief	Triggered by the menu or context menu ( future ), deletes one or more items
		 *
		 * @details	Deletes all checked items, whether they are folders or files one by one
		 *
		 * @return	void
		 */
		deleteCheckedItems()
		{
			const deletePromises	= [];
			const items				= [];

			for ( const item of this.checkedItems )
			{
				deletePromises.push( communicator.deleteItem( item ) );
				items.push( item.name );
			}

			Promise.all( deletePromises ).then(( promises ) => {
				for ( const promise of promises )
					if ( typeof promise.error !== 'undefined' )
						this.browseErrorMessage	=  this.formatErrorMessage( promise.error ) + '. Other errors may have occurred if multiple items were being deleted.';

				this.browse( this.currentDirectory );
			}).catch(( errors ) => {
				this.browseErrorMessage	= `An error has occurred ${errors[0]}`;
			})
		},

		/**
		 * @brief	Formats and returns an error message given an error
		 *
		 * @param	{Object} error
		 *
		 * @return	{String}
		 */
		formatErrorMessage( error )
		{
			return `An error has occurred: Code: ${error.code}${error.message ? `, message: ${error.message}` : ''}`
		}
	}
}
</script>

<style scoped>
</style>