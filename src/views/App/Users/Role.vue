<template>
	<Back @click="$router.push( { name: 'users' } )" class="mb-10"/>

	<div class="rounded-t-lg mx-auto text-gray-200 text-2xl p-5">
		WORK IN PROGRESS
	</div>
</template>

<script>
import Back	from "@/views/App/Components/Back";

export default {
	name: 'UsersRole',

	components: { Back },

	data: () => {
		return {
		};
	},

	/**
	 * @brief	When the component is created, load the data
	 *
	 * @return	void
	 */
	async created()
	{
		await this.loadData();
	},

	methods: {
		/**
		 * @brief	Loads the role data
		 *
		 * @return	void
		 */
		async loadData()
		{
		}
	}
}
</script>

<style scoped>

</style>