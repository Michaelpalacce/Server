<template>
	<nav class="bg-gray-800">
		<div class="max-w-7xl mx-auto relative flex items-center justify-between sm:items-stretch sm:justify-start p-3">
			<div class="hidden sm:block sm:ml-6">
				<div class="flex space-x-4">
					<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/dashboard">Dashboard</router-link>
					<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/browse">Browse</router-link>

					<button class="bg-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium" type="button" @click="logout">
						Logout
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="sm:hidden" id="mobile-menu">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<router-link class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" to="/dashboard">Dashboard</router-link>
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" to="/browse">Browse</router-link>
				<button class="bg-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium" type="button" @click="logout">
					Logout
				</button>
			</div>
		</div>
	</nav>
</template>

<script>
import communicator from "@/app/main/api/communicator";

export default {
	name: "Navbar",
	methods: {
		/**
		 * @brief	Logs the user out
		 *
		 * @details	After logout, redirect the user to /
		 * 			In case of error, still redirect the user to /
		 *
		 * @return	void
		 */
		async logout()
		{
			await communicator.logout().catch(()=>{});

			this.emitter.emit( 'user.credentials' );
			this.$router.push( '/' );
		}
	}
}
</script>