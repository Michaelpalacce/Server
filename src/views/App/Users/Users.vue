<template>
	<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mx-auto w-4/5 my-5"/>

	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5" v-if="users.length !== 0">
		<UserItem
			v-for="user in users"

			:key="user"
			:initialName="user"
			@on-click="userClicked( user )"
		/>

		<Button text="Add new User" @click="addNewUser" class="mt-5"/>
	</div>
</template>

<script>
import communicator			from "@/app/main/api/communicator";
import UserItem				from "./Components/UserItem"
import Error				from "@/views/App/Components/Error";
import formatErrorMessage	from "@/app/main/utils/error_message_format";
import Button				from "@/views/App/Components/Button";


export default {
	name: 'Users',
	data: () => {
		return {
			users			: [],
			errorMessage	: ''
		};
	},

	components: {
		Button,
		Error,
		UserItem
	},

	async mounted()
	{
		await this.loadUsers();
	},

	methods: {
		/**
		 * @brief	Loads and displays all the users
		 *
		 * @return	void
		 */
		async loadUsers()
		{
			const usersResponse	= await communicator.getUsers().catch(( error ) => {
				return error;
			});

			if ( usersResponse.error )
				return this.errorMessage	= formatErrorMessage( usersResponse.error );

			this.users	= usersResponse;
		},

		/**
		 * @brief	Redirects to the user route with the selected username
		 *
		 * @param	{String} username
		 *
		 * @return	void
		 */
		userClicked( username )
		{
			this.$router.push( { name: 'users-user', params: { username } } );
		},

		/**
		 * @brief	Adds a new user to the system with the given username and password and a role of user
		 *
		 * @return	void
		 */
		async addNewUser()
		{
			const username	= prompt( 'Choose Username:' );
			const password	= prompt( 'Choose Password:' );

			if ( ! username && ! password )
				return;

			const createUserResponse	= await communicator.createUser( username, password ).catch(( error ) => {
				return error;
			});

			if ( createUserResponse.error )
				return this.errorMessage	= formatErrorMessage( createUserResponse.error );

			this.users.push( username );
		}
	}
}
</script>

<style scoped>

</style>