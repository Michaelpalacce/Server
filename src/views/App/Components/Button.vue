<template>
	<div :class="`inline-block cursor-pointer py-2 px-7 rounded-3xl ${hasBorder ? 'border' : ''}
									border-${borderColor} bg-${bgColor} hover:bg-${hoverBgColor} hover:text-${hoverTextColor} text-${textColor}
									focus:outline-none text-${textSize}`">{{ text }}</div>
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
			default: 'gray-500'
		},
		bgColor: {
			type: String,
			default: 'gray-800'
		},
		hoverBgColor: {
			type: String,
			default: 'gray-400'
		},
		hoverTextColor: {
			type: String,
			default: 'black'
		},
		textColor: {
			type: String,
			default: 'white'
		},
		textSize: {
			type: String,
			default: 'base'
		},
		text: String
	}
}
</script>

<style scoped>

</style>