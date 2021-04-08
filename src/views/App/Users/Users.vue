<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5">
		<Error :errorMessage="errorMessage" class="mx-auto w-4/5 my-5"/>

		<UserItem
			v-for="user in users"

			:key="user"
			:initialName="user"
			@on-click="userClicked( user )"
		/>
	</div>

</template>

<script>
import communicator			from "@/app/main/api/communicator";
import UserItem				from "./Components/UserItem"
import Error				from "@/views/App/Components/Error";
import formatErrorMessage	from "@/app/main/utils/error_message_format";


export default {
	name: 'Users',
	data: () => {
		return {
			users			: [],
			errorMessage	: ''
		};
	},

	components: {
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
			this.$router.push( { path: 'user', query: { username } } );
		}
	}
}
</script>

<style scoped>

</style>