<template>
	<div class="bg-gray-800 text-white px-4 py-3 rounded relative flex flex-wrap text-base" v-if="errorMessage" role="alert">
		<span class="block sm:inline w-11/12"><i class="fa fa-warning inline-block text-red-500 my-auto mr-3"></i>{{errorMessage}}</span>
		<span @click="errorMessage = ''; $emit( 'clear-click' )" class=" absolute top-0 bottom-0 right-0 px-4 py-3"><svg class="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg></span>
	</div>
</template>

<script>
export default {
	name: 'Error',
	props: {
		errorMessage: String
	}
}
</script>

<style scoped>

</style>