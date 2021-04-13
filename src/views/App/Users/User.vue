<template>
	<Back @click="$router.push( { name: 'users' } )" class="mb-10"/>

	<div class="rounded-t-lg mx-auto text-gray-200 text-2xl p-5">
		<div class="mx-auto">
			<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>

			<TitleSection title="User settings" />

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Username</span>
					<span class="w-full text-base text-blue-300">{{ user ? user.getUsername() : '' }}</span>
				</div>

				<div class="w-2/12">
					<Button text="Change" @click="changeUsername"/>
				</div>
			</div>
			<Divider />

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Change Password</span>
					<span class="w-full text-base">Password must be more than 3 characters</span>
				</div>

				<div class="w-2/12">
					<Button text="Change" @click="changePassword"/>
				</div>
			</div>
			<Divider />

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Delete User</span>
				</div>

				<div class="w-2/12">
					<Button bg-color="bg-red-500" hover-bg-color="hover:bg-red-400" text="Delete" @click="deleteUser"/>
				</div>
			</div>
			<Divider />

			<TitleSection title="Permissions" class="mt-32"/>
			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Roles</span>
					<span class="w-full text-sm">Role order matters!</span>
					<span class="w-full text-base text-blue-300">{{ user ? user.roles.join( ',' ) : '' }}</span>
				</div>
				<div class="w-2/12">
					<Button text="Change" @click="changeRoles"/>
				</div>
			</div>
			<Divider />
			<div class="flex w-full">
				<div class="w-8/12 sm:w-9/12 flex flex-col">
					<span class="w-full">User Permissions</span>
					<span class="w-full text-sm">User Permissions are taken with priority over role permissions.</span>
					<span class="w-full text-sm">Below are displayed only user permissions</span>
					<pre class="w-full text-base text-blue-300 max-h-64 overflow-y-auto">{{permissions}}</pre>
				</div>

				<div class="w-0 sm:w-1/12 invisible"></div>

				<div class="w-2/12">
					<Button text="Change" @click="changePermissions"/>
				</div>
			</div>
			<Divider />

			<TitleSection title="Browse Module" class="mt-32"/>

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Route</span>
					<span class="w-full text-sm">Route that the user can access when browsing.</span>
					<span class="w-full text-base text-blue-300">{{ user ? user.getBrowseMetadata().getRoute() : '' }}</span>
				</div>

				<div class="w-2/12">
					<Button text="Change" @click="changeRoute"/>
				</div>
			</div>
			<Divider />
		</div>
	</div>
</template>

<script>
import Back					from "@/views/App/Components/Back";
import Divider				from "@/views/App/Components/Divider";
import Button				from "@/views/App/Components/Button";
import TitleSection			from "@/views/App/Users/Components/TitleSection";
import communicator			from "@/app/main/api/communicator";
import formatErrorMessage	from "@/app/main/utils/error_message_format";
import Error				from "@/views/App/Components/Error";
import User					from "@/../api/main/user/user"

export default {
	name: 'UsersUser',

	components: { Error, TitleSection, Button, Divider, Back },

	data: () => {
		return {
			username: '',
			user: null,
			errorMessage: '',
			permissions: ''
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
			this.username	= this.$route.params.username || null;

			if ( this.username === null )
				return this.$router.push( { name: 'users' } );

			const userDataResponse	= await communicator.getUserData( this.username ).catch(( error ) => {
				return error;
			});

			if ( userDataResponse.error )
				return this.errorMessage	= formatErrorMessage( userDataResponse.error );

			this.user			= new User( userDataResponse );
			this.permissions	= JSON.stringify( JSON.parse( this.user.getFormattedUserPermissions() ), undefined, 2 );
		},

		/**
		 * @brief	Deletes the user and redirects the client back to the users section
		 *
		 * @return	void
		 */
		async deleteUser()
		{
			const deleteUserResponse	= await communicator.deleteUser( this.username ).catch(( error )=> {
				return error;
			});

			if ( deleteUserResponse.error )
				return this.errorMessage	= formatErrorMessage( deleteUserResponse.error );

			if ( this.username === localStorage.name )
			{
				await communicator.logout().catch(()=>{});
				this.emitter.emit( 'user.credentials' );
				await this.$router.push( '/' );
			}
			else
				await this.$router.push( { name: 'users' } );
		},

		/**
		 * @brief	Updates the username of the user
		 *
		 * @return {Promise<void>}
		 */
		async changeUsername()
		{
			const username	= prompt( 'New username:', this.user.getUsername() );

			if ( ! username )
				return;

			const newUser	= new User( this.user.getUserData() );
			const oldUser	= new User( this.user.getUserData() );
			if ( ! newUser.setUsername( username ) )
				return;

			const updateUserResponse	= await communicator.updateUser( oldUser.getUserData(), newUser.getUserData() ).catch(( error )=> {
				return error;
			});

			await this._updateUserFromResponse( updateUserResponse, newUser, oldUser );
		},

		/**
		 * @brief	Updates the user's route
		 *
		 * @return {Promise<void>}
		 */
		async changeRoute()
		{
			const route	= prompt( 'New route:', this.user.getBrowseMetadata().getRoute() );

			if ( ! route )
				return;

			const newUser	= new User( this.user.getUserData() );
			const oldUser	= new User( this.user.getUserData() );
			newUser.getBrowseMetadata().setRoute( route )

			const updateUserResponse	= await communicator.updateUser( oldUser.getUserData(), newUser.getUserData() ).catch(( error )=> {
				return error;
			});

			await this._updateUserFromResponse( updateUserResponse, newUser, oldUser );
		},

		/**
		 * @brief	Changes a user's password
		 *
		 * @return	{Promise<void>}
		 */
		async changePassword()
		{
			const password	= prompt( 'New password:' );

			if ( ! password )
				return;

			const newUser	= new User( this.user.getUserData() );
			const oldUser	= new User( this.user.getUserData() );
			if ( ! newUser.setPassword( password ) )
				return;

			const updateUserResponse	= await communicator.updateUser( oldUser.getUserData(), newUser.getUserData() ).catch(( error )=> {
				return error;
			});

			await this._updateUserFromResponse( updateUserResponse, newUser, oldUser );
		},

		/**
		 * @brief	Navigates to the user's roles page
		 *
		 * @return	{Promise<void>}
		 */
		changeRoles()
		{
			this.$router.push( { name: 'user-roles', params: { username: this.username } } );
		},

		/**
		 * @brief	Navigates to the user's permissions page
		 *
		 * @return	{Promise<void>}
		 */
		changePermissions()
		{
			this.$router.push( { name: 'user-permissions', params: { username: this.username } } );
		},

		/**
		 * @brief	Accepts the updateUserResponse as well as the newUser and oldUser objects and updates the view
		 *
		 * @param	{Object} updateUserResponse
		 * @param	{Object} newUser
		 * @param	{Object} oldUser
		 *
		 * @return	{Promise<void>}
		 */
		async _updateUserFromResponse( updateUserResponse, newUser, oldUser )
		{
			if ( updateUserResponse.error )
				return this.errorMessage	= formatErrorMessage( updateUserResponse.error );

			if ( localStorage.name !== newUser.getUsername() && localStorage.name === oldUser.getUsername() )
			{
				await communicator.logout().catch(()=>{});
				this.emitter.emit( 'user.credentials' );
				await this.$router.push( '/' );
			}
			else
			{
				this.user			= new User( updateUserResponse );
				this.permissions	= JSON.stringify( JSON.parse( this.user.getFormattedUserPermissions() ), undefined, 2 );

				if ( this.username !== this.user.getUsername() )
					await this.$router.replace( { name: 'user', params: { username: this.user.getUsername() } } )

				this.username	= this.user.getUsername();
			}
		}
	}
}
</script>

<style scoped>

</style>