<template>
	<Back @click="$router.go( -1 )" class="mb-10"/>

	<div class="rounded-t-lg mx-auto text-gray-200 text-2xl p-5">
		<div class="mx-auto">
			<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>
			<Message :message="infoMessage" @clear="infoMessage = ''" :closable="true" class="mb-5"/>

			<TitleSection title="User settings" />

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Username</span>
					<span class="w-full text-base text-blue-300">{{ username }}</span>
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

			<div class="flex w-full">
				<div class="w-8/12 sm:w-10/12 flex flex-col">
					<span class="w-full">Logout</span>
				</div>

				<div class="w-2/12">
					<Button bg-color="bg-red-500" hover-bg-color="hover:bg-red-400" text="Logout" @click="logout"/>
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
import Message from "@/views/App/Components/Message";

export default {
	name: 'User',

	components: {Message, Error, TitleSection, Button, Divider, Back },

	data: () => {
		return {
			username		: '',
			errorMessage	: '',
			infoMessage		: ''
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
			this.username	= localStorage.name || null;

			if ( this.username === null )
				this.logout();
		},

		/**
		 * @brief	Deletes the user and redirects the client back to the users section
		 *
		 * @return	void
		 */
		async deleteUser()
		{
			if ( ! confirm( 'Are you sure?' ) )
				return;

			const deleteUserResponse	= await communicator.deleteCurrentUser().catch(( error )=> {
				return error;
			});

			if ( deleteUserResponse.error )
				return this.errorMessage	= formatErrorMessage( deleteUserResponse.error );

			await this.logout();
		},

		/**
		 * @brief	Deletes the user and redirects the client back to the users section
		 *
		 * @return	void
		 */
		async changePassword()
		{
			const password			= prompt( 'New password:' );
			const passwordConfirm	= prompt( 'Confirm New password:' );

			if ( ! password )
				return;

			if ( password !== passwordConfirm )
				return this.errorMessage	= 'Passwords mismatch';


			const changePasswordResponse	= await communicator.changeCurrentUserPassword( password ).catch(( error )=> {
				return error;
			});

			if ( changePasswordResponse.error )
				return this.errorMessage	= formatErrorMessage( changePasswordResponse.error );

			this.infoMessage	= 'Password successfully changed!';

			setTimeout( () => { this.infoMessage = ''; }, 3000 );
		},

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
			await this.$router.push( { name: 'login' } );
		},
	}
}
</script>

<style scoped>

</style>