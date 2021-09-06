<template>
	<div
		class="text-white text-sm lg:text-base bg-gray-700 inline-block"
		:class="`${isSticky ? 'sticky top-0' : ''}`"
	>

		<div class="inline-block" v-for="element in elements">
			<MenuElement  :text="element.text" @on-click="$emit( element.eventName )" :isDisabled="element.isDisabled" v-if="element.shown"/>
		</div>
	</div>
</template>

<script>
import MenuElement	from "@/views/App/Components/SubComponent/MenuElement";

export default {
	name		: 'GeneralMenu',
	components	: { MenuElement },
	props		: {
		elements	: {
			type	: Array,
			default	: [
				{
					text		: 'Default',
					eventName	: 'default-click',
					shown		: true,
					isDisabled	: false
				},
			]
		},
		isSticky	: {
			type	: Boolean,
			default	: true
		}
	}
}
</script>

<style scoped>
</style>
