<template>
	<h5 :class="`border-b ${borderColor} mb-10 text-base`">{{ title }}</h5>
</template>

<script>
export default {
	name: 'TitleSection',
	props: {
		title: String,
		borderColor: {
			type: String,
			default: 'border-gray-600'
		}
	}
}
</script>

<style scoped>

</style>