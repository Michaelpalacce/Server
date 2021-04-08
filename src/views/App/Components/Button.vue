<template>
	<button type="submit" :class="`w-auto py-2 px-7 rounded-3xl ${hasBorder ? 'border' : ''}
									border-${borderColor} bg-${bgColor} hover:bg-${hoverBgColor} hover:text-${hoverTextColor} text-${textColor}
									focus:outline-none`">{{ text }}</button>
</template>

<script>
export default {
	name: 'Button',
	props: {
		hasBorder: {
			type: Boolean,
			default: true
		},
		borderColor: {
			type: String,
			default: 'gray-600'
		},
		bgColor: {
			type: String,
			default: 'gray-800'
		},
		hoverBgColor: {
			type: String,
			default: 'gray-300'
		},
		hoverTextColor: {
			type: String,
			default: 'black'
		},
		textColor: {
			type: String,
			default: 'gray-200'
		},
		text: String
	}
}
</script>

<style scoped>

</style>