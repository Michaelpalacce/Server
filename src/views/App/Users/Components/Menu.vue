<template>
	<div class="text-left
				text-white bg-gray-700
				md:w-full text-sm md:text-base
				sticky top-0">
		<div class="px-4 py-3 inline-block cursor-pointer hover:bg-gray-600" @click="$emit( 'refresh-click' )">Refresh</div>
	</div>
</template>

<script>
export default {
	name: "Menu"
}
</script>
<style>

</style>