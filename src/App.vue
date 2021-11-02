<template>
	<Navbar v-if="loggedIn === true" />
	<router-view/>
	<Footer />
</template>

<script>
import communicator	from "@/app/main/api/communicator"
import Navbar		from "@/views/App/Components/Navbar";
import Footer		from "./Footer";

export default {
	name: 'App',
	data() {
		return {
			loggedIn: !! localStorage.loggedIn
		}
	},
	components: {
		Footer,
		Navbar
	},
	/**
	 * @brief	On creation, redirect the user to the login page if no credentials are set
	 */
	created: async function () {
		if ( ! communicator.hasCredentials() )
			await this.$router.push( '/' );

		// Handle user credentials change
		this.emitter.on( 'user.credentials', () => { this.loggedIn	= !! localStorage.loggedIn; });
	}
}
</script>
