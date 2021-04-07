<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5">
		<Back @click="$router.go( -1 )" class="mb-5"/>

		<div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
			<div class="bg-gray-800 px-6 py-8 rounded shadow-md text-black w-full text-white">
				<h1 class="text-center text-2xl mb-2">Username</h1>

				<input
					type="text"
					class="block border border-white w-full p-3 rounded mb-4 bg-gray-600"
					name="username"
					:value="user"
					placeholder="Username" />
				<button
					type="submit"
					class="w-full text-center py-3 rounded bg-gray-600 hover:bg-gray-300 hover:text-black focus:outline-none my-1"
				>Update</button>
			</div>
		</div>

		<div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2 mt-10">
			<div class="bg-gray-800 px-6 py-8 rounded shadow-md text-black w-full text-white">
				<h1 class="text-center text-2xl mb-2">Password</h1>

				<input
					type="password"
					class="block border border-white w-full p-3 rounded mb-4 bg-gray-600"
					name="password"
					placeholder="Password" />
				<input
					type="password"
					class="block border border-white w-full p-3 rounded mb-4 bg-gray-600"
					name="confirm-password"
					placeholder="Confirm Password" />
				<button
					type="submit"
					class="w-full text-center py-3 rounded bg-gray-600 hover:bg-gray-300 hover:text-black focus:outline-none my-1"
				>Update</button>
			</div>
		</div>
	</div>
</template>

<script>
import Back	from "@/views/App/Components/Back";

export default {
	name: 'User',

	components: { Back },

	data: () => {
		return {
			user: ''
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
		 * @brief	Loads the user data
		 *
		 * @return	void
		 */
		async loadData()
		{
			this.user	= this.$route.query.user || null;

			if ( this.user === null )
				this.$router.push( 'users' );
		}
	}
}
</script>

<style scoped>

</style>