<template>
	<div class="text-left
				text-white bg-gray-700
				md:w-full text-sm md:text-base
				sticky top-0">
		<MenuElement text="Refresh" @on-click="$emit( 'refresh-click' )"/>
		<MenuElement text="Upload" @on-click="$emit( 'upload-click' )"/>
		<MenuElement text="New Folder" @on-click="$emit( 'new-folder-click' )"/>
		<MenuElement text="Paste" @on-click="$emit( 'paste-click' )" v-if="showPaste"/>

		<div class="border-l-2 inline mx-2"></div>
		<MenuElement text="Rename" :isDisabled="renameDisabled" @on-click="$emit( 'rename-click' )"/>
		<MenuElement text="Download" :isDisabled="downloadDisabled" @on-click="$emit( 'download-click' )"/>
		<MenuElement text="Delete" :isDisabled="deleteDisabled" @on-click="$emit( 'delete-click' )"/>
		<MenuElement text="Copy" :isDisabled="copyDisabled" @on-click="$emit( 'copy-click' )"/>
		<MenuElement text="Cut" :isDisabled="cutDisabled" @on-click="$emit( 'cut-click' )"/>
	</div>
</template>

<script>
import MenuElement	from "@/views/App/Browse/Components/MenuComponents/MenuElement";

export default {
	name		: 'Menu',
	components	: { MenuElement },
	props		: {
		showPaste		: {
			type	: Boolean,
			default	: true
		},
		renameDisabled		: {
			type	: Boolean,
			default	: true
		},
		downloadDisabled	: {
			type	: Boolean,
			default	: false
		},
		deleteDisabled		: {
			type	: Boolean,
			default	: false
		},
		copyDisabled		: {
			type	: Boolean,
			default	: false
		},
		cutDisabled			: {
			type	: Boolean,
			default	: false
		}
	}
}
</script>

<style scoped>
</style>