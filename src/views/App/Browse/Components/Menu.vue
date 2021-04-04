<template>
	<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">
		<MenuElement key="Refresh" text="Refresh" @on-click="$emit( 'refresh-click' )"/>
		<MenuElement key="Upload" text="Upload" @on-click="$emit( 'upload-click' )"/>
		<MenuElement key="NewFolder" text="New Folder" @on-click="$emit( 'new-folder-click' )"/>

		<div class="border-l-2 inline mx-2"></div>
		<MenuElement key="Rename" text="Rename" :isDisabled="renameDisabled" @on-click="$emit( 'rename-click' )"/>
		<MenuElement key="Download" text="Download" :isDisabled="downloadDisabled" @on-click="$emit( 'download-click' )"/>
		<MenuElement key="Delete" text="Delete" :isDisabled="deleteDisabled" @on-click="$emit( 'delete-click' )"/>
		<MenuElement key="Copy" text="Copy" :isDisabled="copyDisabled" @on-click="$emit( 'copy-click' )"/>
		<MenuElement key="Move" text="Move" :isDisabled="moveDisabled" @on-click="$emit( 'move-click' )"/>
	</div>
</template>

<script>
import MenuElement	from "@/views/App/Browse/Components/MenuComponents/MenuElement";

export default {
	name		: 'Menu',
	components	: { MenuElement },
	props		: {
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
		moveDisabled		: {
			type	: Boolean,
			default	: false
		}
	}
}
</script>

<style scoped>

</style>