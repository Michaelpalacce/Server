<template>
	<div class="bg-gray-800">
		<div class="hidden sm:block max-w-7xl mx-auto text-lg relative flex items-center justify-between sm:items-stretch sm:justify-start p-3 ">
			<div class="flex">
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-2 rounded-md" to="/dashboard">Dashboard</router-link>
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-2 rounded-md" to="/browse">Browse</router-link>
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 mx-2 rounded-md" to="/users">Users</router-link>
				<div class="bg-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md absolute right-5 text-center cursor-pointer" @click="logout">
					Logout
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="sm:hidden">
			<button class="hamburger hamburger--elastic w-full text-right" type="button" @click="mobileCollapsed = ! mobileCollapsed">
				<span class="hamburger-box" >
					<span class="hamburger-inner" ></span>
				</span>
			</button>

			<div class="px-2 pt-2 pb-3 text-lg" :class="{ hidden: mobileCollapsed }">
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 my-2 rounded-md" to="/dashboard">Dashboard</router-link>
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 my-2 rounded-md" to="/browse">Browse</router-link>
				<router-link class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 my-2 rounded-md" to="/users">Users</router-link>
				<div class="bg-red-500 hover:bg-red-600 hover:text-white block px-3 py-2 text-center cursor-pointer rounded-md mx-auto mt-5 w-1/3 "  @click="logout">
					Logout
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import communicator from "@/app/main/api/communicator";

export default {
	name: "Navbar",
	data: () => {
		return {
			mobileCollapsed: true
		};
	},

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

			localStorage.name	= '';
			this.emitter.emit( 'user.credentials' );
			this.$router.push( '/' );
		}
	}
}
</script>

<style scoped>
@import './../../../style/hamburger.css';

.router-link-active{
	background-color: #111827;
	color: white;
}
.router-link-active:hover{
	background-color: #111827;
	color: white;
}

.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
	background-color: white;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
	background-color: white;
}
</style>