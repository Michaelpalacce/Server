<template>
	<div class="rounded-t-lg m-5 mx-auto bg-gray-700 text-gray-200 px-5">
		<div class="text-left border-b border-gray-300 table-row md:w-full text-sm md:text-base">
			<div class="px-4 py-3 inline-block">Rename</div>
			<div class="px-4 py-3 inline-block">Download</div>
			<div class="px-4 py-3 inline-block">Delete</div>
			<div class="px-4 py-3 inline-block">Copy</div>
			<div class="px-4 py-3 inline-block">Move</div>
		</div>
		<BrowseItem name="VERY LONG FOLDER NAME YALLLLLLLLLLL LLLLLLLLLLLLLL LLLLLLLLLLLLLLLLLLLLLLLW"/>
		<BrowseItem name="Short Name"/>
	</div>
</template>

<script>
import BrowseItem from "@/views/App/Components/Browse/BrowseItem";

export default {
	name: 'Browse',
	components: {
		BrowseItem
	}
}
</script>

<style scoped>

</style>