<template>
	<Navbar v-if="loggedIn === true" />
	<router-view/>
</template>

<script>
import communicator	from "@/app/main/api/communicator"
import Navbar		from "@/views/App/Components/Navbar";

export default {
	name: 'App',
	data()
	{
		return {
			loggedIn: !! localStorage.loggedIn
		}
	},
	components: {
		Navbar
	},
	/**
	 * @brief	On creation, redirect the user to the login page if no credentials are set
	 */
	created: function () {
		if ( ! communicator.hasCredentials() )
			this.$router.push( '/' );

		// Handle user credentials change
		this.emitter.on( 'user.credentials', () => { this.loggedIn	= !! localStorage.loggedIn; });
	}
}
</script>
