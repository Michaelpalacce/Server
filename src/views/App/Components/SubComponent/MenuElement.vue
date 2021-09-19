<template>
	<div class="px-4 py-3 inline-block"
		:class="[isDisabled ? `cursor-default hover:bg-gray-700 text-gray-400` : 'cursor-pointer hover:bg-gray-600']"
		@click="isDisabled ? null : $emit( 'on-click' )"
		v-if="! hideIfDisabled && ! isDisabled"
		:title="iconTitle"
	>
		<span v-if="! isIcon">
			{{ text }}
		</span>
		<i :class="`text-2xl fa-2x ${text}`" v-else></i>
	</div>
</template>

<script>
export default {
	name: "MenuElement",
	props	: {
		text		: String,
		isDisabled	: Boolean,
		hideIfDisabled	 : {
			type: Boolean,
			default: false
		},
		isIcon		: {
			type: Boolean,
			default: false
		},
		iconTitle	: {
			type: String,
			default: ''
		}
	}
}
</script>