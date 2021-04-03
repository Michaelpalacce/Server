<template>
	<div class="mt-10 text-white max-w-7xl mx-auto relative flex items-center justify-between sm:items-stretch sm:justify-start p-3">
		<h1 class="mx-auto text-5xl">Welcome {{name}}!</h1>
	</div>
</template>

<script>
export default {
	name	: 'Dashboard',
	data	: () => {
		return {
			name: localStorage.name
		};
	}
}
</script>

<style scoped>

</style>