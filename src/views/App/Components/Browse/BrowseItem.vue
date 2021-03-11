<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 bg-gray-700 hover:bg-gray-600
				cursor-pointer"
	>
		<span class="fa fa-folder-open md:hidden fa-3x w-1/6"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-5/6 inline-block">
				<p class="truncate">
					<i class="fa fa-folder-open mr-2 hidden md:inline-block"></i>
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
		name: String
	}
}
</script>

<style scoped>
	.menu-bar{
		width: 35px;
		height: 4px;
		background-color: gray;
		margin: 6px 0;
	}
</style>