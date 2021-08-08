<template>
	<div :class="`inline-block cursor-pointer py-2 px-4 rounded-3xl ${hasBorder ? 'border' : ''}
									${borderColor} ${bgColor} ${hoverBgColor} ${hoverTextColor} ${textColor}
									focus:outline-none ${textSize}`">{{ text }}</div>
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
			default: 'border-gray-500'
		},
		bgColor: {
			type: String,
			default: 'bg-gray-800'
		},
		hoverBgColor: {
			type: String,
			default: 'hover:bg-gray-400'
		},
		hoverTextColor: {
			type: String,
			default: 'hover:text-black'
		},
		textColor: {
			type: String,
			default: 'text-white'
		},
		textSize: {
			type: String,
			default: 'text-base'
		},
		text: String
	}
}
</script>

<style scoped>

</style>