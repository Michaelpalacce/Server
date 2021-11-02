<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5 mb-64" v-if="upload === false">
		<div class="sticky top-0 bg-gray-700">
			<GeneralMenu
				:elements="leftMenu"
				@upload-click="showUpload"
				@refresh-click="browse( currentDirectory )"
				@new-folder-click="createNewFolder"
			/>

			<GeneralMenu
				class="md:float-right float-none"
				:elements="rightMenu"
				@delete-click="deleteCheckedItems"
				@rename-click="onRenameClick"
				@copy-click="onCopyClick"
				@cut-click="onCutClick"
				@paste-click="onPasteClick"
				@download-click="onDownloadClick"
				@favorite-click="onFavoriteClick"
			/>
		</div>
		<Back @click="browse( previousDirectory )" :backValue="decodedCurrentDir" class="mt-10"/>

		<Error :errorMessage="browseErrorMessage" class="mx-auto w-4/5 my-5"/>

		<transition name="browse">
			<div v-if="items !== null">
				<BrowseItem
					v-for="(item, index) in items"

					:key="item.encodedURI"
					:initialName="item.name"
					:isFolder="item.isDir"
					:fileType="item.fileType"
					:initialEncodedURI="item.encodedURI"
					:previewAvailable="item.previewAvailable"
					:size="item.size"
					:mTime="item.mTime"
					@on-shift-click="shiftClick( index )"
					@on-ctrl-click="ctrlClick( index )"
					@on-click="onItemClick( index, item )"
					@on-checked="onItemChecked"

					:ref="item.encodedURI"
				/>
			</div>
		</transition>
	</div>
	<div v-else>
		<Back @click="upload = ! canBrowse; uploadErrorMessage = ''" class="mb-5"/>

		<div class="rounded-t-lg m-5 mx-auto btext-gray-200 px-5">
			<Error :errorMessage="uploadErrorMessage" @clear="uploadErrorMessage = ''" class="mx-auto w-4/5"/>
			<Message message="You may need to refresh the folder after uploading a Folder. This is not needed when uploading files." class="my-5"/>

			<form class="dropzone w-full sm:w-2/3" method="POST" >
				<input type="hidden" name="directory" id="upload-file" :value="currentDirectory">
			</form>

			<form action="/api/browse/file" method="POST" enctype="multipart/form-data" onchange="this.submit();" class="mt-5">
				<input type="file" name="file" id="file" class="hidden" webkitdirectory mozdirectory />
				<div class="text-center justify-center mx-auto">
					<label for="file" class="bg-gray-800 p-3 rounded-2xl border border-gray-400 text-gray-200 cursor-pointer hover:text-black hover:bg-gray-300">Upload Folder</label>
				</div>
				<input type="hidden" name="directory" :value="currentDirectory" >
			</form>
		</div>
	</div>
</template>

<script>
import BrowseItem			from "@/views/App/Browse/Components/BrowseItem";
import MenuElement			from "@/views/App/Components/SubComponent/MenuElement";
import communicator			from "@/app/main/api/communicator";
import { encode, decode }	from '@/../api/main/utils/base_64_encoder';
import Dropzone				from '@/app/lib/dropzone';
import Error				from "@/views/App/Components/Error";
import Back					from "@/views/App/Components/Back";
import formatErrorMessage	from "@/app/main/utils/error_message_format";
import Message				from "@/views/App/Components/Message";
import GeneralMenu			from "@/views/App/Components/GeneralMenu";

export default {
	name: 'Browse',
	components: { GeneralMenu, Message, Error, BrowseItem, MenuElement, Back },

	data: () => {
		const refreshMenuEl		= {
			text		: 'fas fa-sync',
			eventName	: 'refresh-click',
			iconTitle	: 'Refresh',
			shown		: true,
			isIcon		: true,
			isDisabled	: false
		};
		const uploadMenuEl		= {
			text		: 'fas fa-upload',
			eventName	: 'upload-click',
			iconTitle	: 'Upload',
			shown		: true,
			isIcon		: true,
			isDisabled	: false
		};
		const newFolderMenuEl	= {
			text		: 'fas fa-folder-plus',
			eventName	: 'new-folder-click',
			iconTitle	: 'New Folder',
			isIcon		: true,
			shown		: true,
			isDisabled	: false
		};
		const renameMenuEl		= {
			text		: 'fas fa-pen',
			eventName	: 'rename-click',
			iconTitle	: 'Rename',
			shown		: true,
			isIcon		: true,
			isDisabled	: true
		};
		const downloadMenuEl	= {
			text		: 'fas fa-download',
			eventName	: 'download-click',
			iconTitle	: 'Download',
			shown		: true,
			isIcon		: true,
			isDisabled	: true
		};
		const deleteMenuEl		= {
			text		: 'fa fa-trash',
			eventName	: 'delete-click',
			iconTitle	: 'Delete',
			isIcon		: true,
			shown		: true,
			isDisabled	: true
		};
		const copyMenuEl		= {
			text		: 'fas fa-copy',
			eventName	: 'copy-click',
			iconTitle	: 'Copy',
			isIcon		: true,
			shown		: true,
			isDisabled	: true
		};
		const cutMenuEl			= {
			text		: 'fas fa-cut',
			eventName	: 'cut-click',
			iconTitle	: 'Move',
			shown		: true,
			isIcon		: true,
			isDisabled	: true
		};
		const favoriteMenuEl	= {
			text		: 'fas fa-star',
			eventName	: 'favorite-click',
			iconTitle	: 'Favorite',
			shown		: true,
			isIcon		: true,
			isDisabled	: true
		};
		const pasteMenuEl	= {
			text		: 'fas fa-paste',
			eventName	: 'paste-click',
			iconTitle	: 'Paste',
			shown		: false,
			isIcon		: true,
			isDisabled	: false
		};

		return {
			items				: null,
			nextToken			: '',
			hasMore				: true,
			currentDirectory	: '',
			decodedCurrentDir	: '/', // Default to / in the beginning
			previousDirectory	: '',
			browseErrorMessage	: '',

			loading				: false,
			upload				: false,
			uploadErrorMessage	: '',
			dropzone			: null,
			canBrowse			: true,

			checkedItems		: [],

			leftMenu				: [
				refreshMenuEl, newFolderMenuEl, uploadMenuEl
			],
			rightMenu				: [
				deleteMenuEl, copyMenuEl, cutMenuEl, renameMenuEl, downloadMenuEl, favoriteMenuEl, pasteMenuEl
			],

			refreshMenuEl,
			newFolderMenuEl,
			copyMenuEl,
			cutMenuEl,
			renameMenuEl,
			downloadMenuEl,
			favoriteMenuEl,
			pasteMenuEl,
			uploadMenuEl,
			deleteMenuEl,

			bufferedItems		: [],
			bufferedAction		: '',

			lastShiftIndex		: 0,
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
		this.currentDirectory	= this.$route.query.directory || localStorage.route || ( await communicator.getUserRoute() ).route || null;

		// Load the page
		await this.browse();

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
		 * Shift click event will select all items between the two indexes
		 *
		 * @return	void
		 */
		shiftClick( index ) {
			const startIndex	= this.lastShiftIndex >= index ? index : this.lastShiftIndex;
			const endIndex		= this.lastShiftIndex >= index ? this.lastShiftIndex : index;

			this.items.forEach(
				( item, itemIndex ) => this.$refs[item.encodedURI].setChecked( itemIndex >= startIndex && itemIndex <= endIndex )
			);

			this.lastShiftIndex	= index;
			document.getSelection().removeAllRanges();
		},

		/**
		 * Ctrl click event will reset the lastShiftIndex
		 *
		 * @return	void
		 */
		ctrlClick( index ) {
			this.lastShiftIndex	= index;
		},

		/**
		 * @brief	Triggered when an item is clicked
		 *
		 * @details	This will only trigger the browse function if the item is a folder, otherwise the item will be previewed
		 *
		 * @param	{Number} index
		 * @param	{Object} item
		 *
		 * @return	void
		 */
		onItemClick( index, item ) {
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

			this.lastShiftIndex	= index;
		},

		/**
		 * @brief	Downloads one or many items
		 *
		 * @return	void
		 */
		onDownloadClick() {
			const checkedItems		= [...this.checkedItems];
			const itemsToDownload	= [];

			for ( const checkedItem of checkedItems )
				itemsToDownload.push( decode( checkedItem.encodedURI ) );

			window.location.href	= `/api/browse/items?items=${encode( JSON.stringify( itemsToDownload ) )}`;

			this.uncheckItems();
		},

		/**
		 * @brief	Adds a new browse favorite to the dashboard
		 *
		 * @return	void
		 */
		async onFavoriteClick() {
			const item		= this.checkedItems[0];

			const itemToAdd	= {
				name: item.initialName,
				isFolder: item.isFolder,
				fileType: item.fileType || '',
				previewAvailable: item.previewAvailable,
				encodedURI: item.initialEncodedURI,
				size: item.size
			}

			const response	= await communicator.addFavoriteBrowseItem( itemToAdd ).catch(( error ) => {
				return error;
			});

			if ( response.error )
				return this.browseErrorMessage	= formatErrorMessage( response.error );

			this.uncheckItems();
		},

		/**
		 * @brief	Pastes the buffered items in the current directory
		 *
		 * @return	void
		 */
		async onPasteClick() {
			const items		= [...this.bufferedItems];
			const action	= this.bufferedAction;

			for ( const item of items )
			{
				switch ( action )
				{
					case 'cut':
						const moveResponse	= await communicator.cutItem( item, this.currentDirectory ).catch( ( error ) => {
							return error;
						});

						if ( moveResponse.error )
							return this.browseErrorMessage	= formatErrorMessage( moveResponse.error );

						await this.browse();
						break;

					case 'copy':
						const copyResponse	= await communicator.copyItem( item, this.currentDirectory ).catch( ( error ) => {
							return error;
						});

						if ( copyResponse.error )
							return this.browseErrorMessage	= formatErrorMessage( copyResponse.error );

						await this.browse();
						break;

					default:
						this.browseErrorMessage	= `No such action ${action}`;
						break;
				}
			}

			this.bufferedAction	= '';
			this.bufferedItems	= [];
			this.checkedItems	= [];
		},

		/**
		 * @brief	Sets the checked items in the buffer with the action copy
		 *
		 * @return	void
		 */
		onCopyClick() {
			this._setBufferedItemsWithAction( 'copy' );
		},

		/**
		 * @brief	Sets the checked items in the buffer with the action cut
		 *
		 * @return	void
		 */
		onCutClick() {
			this._setBufferedItemsWithAction( 'cut' );
		},

		/**
		 * @brief	Creates a new folder and adds it to the view
		 *
		 * @todo	Make a better way to create folders than a prompt!
		 *
		 * @return	void
		 */
		async createNewFolder() {
			const folderName	= prompt( 'What should the folder be called?' );

			if ( typeof folderName === 'string' && folderName.length > 0 )
			{
				const newPath				= encode( `${this.decodedCurrentDir}/${folderName}` );
				const createFolderResponse	= await communicator.createFolder( newPath ).catch( ( error ) => {
					return error;
				});

				if ( createFolderResponse.error )
					return this.browseErrorMessage	= formatErrorMessage( createFolderResponse.error );

				const item	= await communicator.getFileData( newPath ).catch( ( error ) => {
					return error;
				});

				if ( item.error )
					return this.uploadErrorMessage	= formatErrorMessage( item.error );

				await this.browse( newPath );
			}
		},

		/**
		 * @brief	Rename the item and set reset the checked items
		 *
		 * @details	This will modify the item and set a new encodedURI
		 *
		 * @return	void
		 */
		async onRenameClick() {
			const item			= this.checkedItems[0];
			const newItemName	= prompt( 'New item name:', item.name );

			if ( typeof newItemName !== 'string' )
				return;

			const encodedNewName	= encode( `${this.decodedCurrentDir}/${newItemName}` );
			const response			= await communicator.renameItem( item, encodedNewName ).catch(( error ) => {
				return error;
			});

			if ( response.error )
				return this.browseErrorMessage	= formatErrorMessage( response.error );

			await this.browse();
		},

		/**
		 * @brief	Triggered when an item checkbox is clicked
		 *
		 * @details	This adds or removes the item from the buffer of checked items
		 *
		 * @return	void
		 */
		onItemChecked( checkedItem ) {
			const item		= checkedItem.item;
			const isChecked	= checkedItem.checked;

			if ( isChecked )
				this.checkedItems	= this.checkedItems.concat( item );
			else
				this.checkedItems	= this.checkedItems.filter( checkedItem => checkedItem.name !== item.name );
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
				// nothing selected
				case ! foldersCount && ! filesCount:
					this.renameMenuEl.isDisabled	= true;
					this.downloadMenuEl.isDisabled	= true;
					this.deleteMenuEl.isDisabled	= true;
					this.copyMenuEl.isDisabled		= true;
					this.cutMenuEl.isDisabled		= true;
					this.favoriteMenuEl.isDisabled	= true;

					break;
				// Either one folder or one file
				case ! foldersCount && filesCount === 1:
				case foldersCount === 1 && ! filesCount:
					this.renameMenuEl.isDisabled	= false;
					this.downloadMenuEl.isDisabled	= false;
					this.deleteMenuEl.isDisabled	= false;
					this.copyMenuEl.isDisabled		= false;
					this.cutMenuEl.isDisabled		= false;
					this.favoriteMenuEl.isDisabled	= false;
					break;

				// Only folders ( more than one )
				case foldersCount !== 0 && ! filesCount:
					this.renameMenuEl.isDisabled	= true;
					this.downloadMenuEl.isDisabled	= false;
					this.deleteMenuEl.isDisabled	= false;
					this.copyMenuEl.isDisabled		= false;
					this.cutMenuEl.isDisabled		= false;
					this.favoriteMenuEl.isDisabled	= true;
					break;

				// Only files ( more than one )
				case ! foldersCount && filesCount !== 0:
					this.renameMenuEl.isDisabled	= true;
					this.downloadMenuEl.isDisabled	= false;
					this.deleteMenuEl.isDisabled	= false;
					this.copyMenuEl.isDisabled		= false;
					this.cutMenuEl.isDisabled		= false;
					this.favoriteMenuEl.isDisabled	= true;
					break;

				// Folders and files
				case foldersCount !== 0 && filesCount !== 0:
					this.renameMenuEl.isDisabled	= true;
					this.downloadMenuEl.isDisabled	= false;
					this.deleteMenuEl.isDisabled	= false;
					this.copyMenuEl.isDisabled		= false;
					this.cutMenuEl.isDisabled		= false;
					this.favoriteMenuEl.isDisabled	= true;
					break;

				default:
					this.renameMenuEl.isDisabled	= false;
					this.downloadMenuEl.isDisabled	= false;
					this.deleteMenuEl.isDisabled	= false;
					this.copyMenuEl.isDisabled		= false;
					this.cutMenuEl.isDisabled		= false;
					this.favoriteMenuEl.isDisabled	= false;
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
		browse	: async function( directory = this.currentDirectory, token = '' )
		{
			directory	= directory === null ? '' : directory;
			if ( this.loading )
				return;

			this.loading	= true;

			const browseResponse	= await communicator.browse( directory, token ).catch( ( error ) => {
				return error;
			});

			if ( this.$route.name !== 'browse' )
				return ;

			const response	= browseResponse.data;

			if ( response.error ) {
				this.loading					= false;
				return this.browseErrorMessage	= formatErrorMessage( response.error );
			}

			const isNewDir			= token === '';
			this.items				= isNewDir ? response.items : this.items.concat( response.items );
			this.previousDirectory	= response.previousDirectory;
			this.currentDirectory	= response.currentDirectory;
			this.decodedCurrentDir	= decode( response.currentDirectory );
			this.nextToken			= response.nextToken;
			this.hasMore			= response.hasMore;
			this.lastShiftIndex		= 0;

			if ( isNewDir )
				this.uncheckItems();

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
						url: `/api/browse/file`,
						method: 'post',
						parallelUploads: 5,
						maxFilesize: 40000,
						timeout:0,
						withCredentials: true
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
							return this.uploadErrorMessage	= formatErrorMessage( item.error );

						this.items	= this.items.concat( [item] );

						setTimeout(() => {
							this.dropzone.removeFile( file );
						}, 2000 );
					});

					this.dropzone.on( 'error', ( file, error ) => {
						error	= JSON.parse( error );
						this.uploadErrorMessage	= formatErrorMessage( error.error )
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
				const itemsNotDeleted	= [];
				const errors			= [];
				for ( const promise of promises )
					if ( typeof promise.data.error !== 'undefined' && typeof promise.data.error.message !== 'undefined' )
					{
						if ( typeof promise.data.error.message.itemName === 'undefined' )
						{
							this.browseErrorMessage	= `Unknown error ( ${promise.data.error.code} ), refresh in 2 seconds!`;

							setTimeout(() => {
								this.$router.go();
							}, 2000 );
							return;
						}

						itemsNotDeleted.push( promise.data.error.message.itemName );
						errors.push( `ITEM: ${promise.data.error.message.itemName}: ${promise.data.error.message.error}` );
					}

				const deletedItems	= this.checkedItems.filter( checkedItem => ! itemsNotDeleted.includes( checkedItem.name ) );
				this.checkedItems	= this.checkedItems.filter( checkedItem => itemsNotDeleted.includes( checkedItem.name ) );

				this.items	= this.items.filter(( item ) => {
					for ( const deletedItem of deletedItems )
						if ( item.name === deletedItem.name )
							return false;

					return true;
				});

				if ( errors.length )
					this.browseErrorMessage	= `Error deleting: ${this.checkedItems.map( item => item.name ).join( ', ' )}. Errors: ${errors.join( ', ' )}`;
				else
					this.browseErrorMessage	= '';

			}).catch(( error ) => {
				this.browseErrorMessage	= `An error has occurred ${error}`;
			})
		},

		/**
		 * @brief	Sets the checked items as buffered items with the given action
		 *
		 * @return	void
		 */
		_setBufferedItemsWithAction( action )
		{
			this.bufferedItems	= [...this.checkedItems];
			this.bufferedAction	= action;

			this.uncheckItems();
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
		},

		/**
		 * @brief	Show paste element if there are any buffered items
		 *
		 * @return	void
		 */
		bufferedItems: function ()
		{
			this.pasteMenuEl.shown	= this.bufferedItems.length !== 0;
		}
	}
}
</script>

<style scoped>
@import './../../../style/dropzone.css';

.browse-enter-active,
.browse-leave-active {
	transition: opacity .25s ease;
}

.browse-enter-from,
.browse-leave-to {
	opacity: 0;
}
</style>
