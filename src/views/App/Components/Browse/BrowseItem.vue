<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 bg-gray-700 hover:bg-gray-600
				cursor-pointer"
	>
		<span class="fa fa-folder-open md:hidden fa-3x w-1/6" v-if="isFolder === true"></span>
		<span class="fa fa-file md:hidden fa-3x w-1/6" v-if="isFolder === false"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-5/6 inline-block">
				<p class="truncate">
					<i class="fa fa-folder-open mr-2 hidden md:inline-block" v-if="isFolder === true"></i>
					<i class="fa fa-file mr-2 hidden md:inline-block" v-if="isFolder === false"></i>
					{{name}}
				</p>
			</div>
			<div class="w-full md:w-1/6 inline-block">
				<p class="truncate">
					<span class="md:hidden mr-2">Size:</span>
					50MB
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BrowseItem",
	props: {
		name: String,
		isFolder: {
			type: Boolean,
			default: true
		}
	}
}
</script>