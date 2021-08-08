<template>
	<div class="m-5">
		<Menu @refresh-click="loadData"/>

		<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mx-auto w-4/5 my-5"/>

		<transition name="view">
			<div class="flex" v-if="users.length > 0 && roles.length > 0">
				<div class="rounded-t-lg p-5 w-1/2" v-if="users.length !== 0">
					<p class="mx-auto text-center text-3xl font-bold text-white mb-5"> Users </p>
					<UserItem
						v-for="user in users"

						:key="user"
						:initialName="user"
						@on-click="userClicked( user )"
					/>

					<Button text="Add new User" @click="addNewUser" class="mt-5"/>
				</div>
				<div class="rounded-t-lg p-5 w-1/2">
					<p class="mx-auto text-center text-3xl font-bold text-white mb-5"> Roles </p>
					<RoleItem
						v-for="role in roles"

						:key="role"
						:initialName="role"
						@on-click="roleClicked( role )"
					/>

					<Button text="Add new Role" @click="addNewRole" class="mt-5"/>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import communicator			from "@/app/main/api/communicator";
import UserItem				from "./Components/UserItem"
import RoleItem				from "./Components/RoleItem"
import Error				from "@/views/App/Components/Error";
import formatErrorMessage	from "@/app/main/utils/error_message_format";
import Button				from "@/views/App/Components/Button";
import Menu					from "./Components/Menu.vue";

export default {
	name: 'Users',
	data: () => {
		return {
			users			: [],
			roles			: [],
			errorMessage	: ''
		};
	},

	components: {
		Button,
		Error,
		UserItem,
		RoleItem,
		Menu
	},

	mounted()
	{
		this.loadData();
	},

	methods: {
		/**
		 * @brief	Loads the users and roles
		 *
		 * @return	void
		 */
		loadData()
		{
			this.users	= [];
			this.roles	= [];

			this.loadUsers();
			this.loadRoles();
		},

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
		 * @brief	Loads and displays all the users
		 *
		 * @return	void
		 */
		async loadRoles()
		{
			const rolesResponse	= await communicator.getRoles().catch(( error ) => {
				return error;
			});

			if ( rolesResponse.error )
				return this.errorMessage	= formatErrorMessage( rolesResponse.error );

			this.roles	= Object.values( rolesResponse ).map( item => item.name );
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
		 * @brief	Redirects to the role route with the selected role
		 *
		 * @param	{String} role
		 *
		 * @return	void
		 */
		roleClicked( role )
		{
			this.$router.push( { name: 'users-role', params: { role } } );
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
		},

		/**
		 * @brief	Takes the user to the add new role page
		 *
		 * @return	void
		 */
		async addNewRole()
		{
			this.$router.push( { name: 'users-new-role' } );
		}
	}
}
</script>

<style scoped>
.view-enter-active,
.view-leave-active {
	transition: opacity .25s ease;
}

.view-enter-from,
.view-leave-to {
	opacity: 0;
}
</style>