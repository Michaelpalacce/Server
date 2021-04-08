<template>
	<h5 :class="`border-b border-${borderColor} mb-10 text-base`">{{ title }}</h5>
</template>

<script>
export default {
	name: 'TitleSection',
	props: {
		title: String,
		borderColor: {
			type: String,
			default: 'gray-600'
		}
	}
}
</script>

<style scoped>

</style>