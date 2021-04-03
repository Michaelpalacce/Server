<template>
	<div class="px-4 py-3 inline-block cursor-pointer hover:bg-gray-600">{{ text }}</div>
</template>

<script>
export default {
	name: "MenuElement",
	props	: {
		text: String
	}
}
</script>