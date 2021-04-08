<template>
	<hr :class="`border-0 my-5 bg-${color} text-${color} h-px`">
</template>

<script>
export default {
	name: 'Divider',
	props: {
		color: {
			type: String,
			default: 'gray-600'
		}
	}
}
</script>

<style scoped>

</style>