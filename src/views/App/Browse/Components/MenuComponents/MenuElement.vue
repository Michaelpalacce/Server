<template>
<!--	<div class="px-4 py-3 inline-block" :class="[isDisabled ? 'cursor-default hover:bg-gray-700 text-gray-400' : 'cursor-pointer hover:bg-gray-600']" @click="isDisabled ? null : $emit( 'on-click' )">{{ text }}</div>-->
	<div class="px-4 py-3 inline-block" @click="isDisabled ? null : $emit( 'on-click' )">{{ text }}</div>
</template>

<script>
export default {
	name: "MenuElement",
	props	: {
		text		: String,
		isDisabled	: Boolean
	}
}
</script>