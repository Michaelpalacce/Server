<template>
	<div class="w-full">
		<Back @click="$router.push( { name: 'users-user', params: { username: $route.params.username } } )" class="mb-10"/>
		<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>

		<div class="text-center text-white">
			<p class="text-base mb-5">Feel free to edit the permissions bellow. For more information: <span class="text-sm text-blue-400"><a href="https://github.com/Michaelpalacce/Server/blob/master/README.md">Docs</a></span></p>
			<p class="text-sm">Note: If you want to use regex, you have to change the value from: <span class="font-bold">`route: /^\/users?(.+)/`</span> to <span class="font-bold">`route: { regexp: { source: "^\\/users?(.+)", flags: "" } }`</span></p>
		</div>

		<textarea v-model="permissions" class="w-full h-64 md:w-2/3 md:h-96 mx-auto my-12 block bg-gray-800 p-5 text-white" cols="50" rows="15"></textarea>
		<div class="flex justify-center">
			<Button @click="changePermissions" text="Change"/>
			<Button @click="permissions = examplePermissions" text="Set example" class="ml-5"/>
		</div>
	</div>
</template>

<script>
import User					from "@/../api/main/user/user"
import communicator			from "@/app/main/api/communicator";
import formatErrorMessage	from "@/app/main/utils/error_message_format";
import Button				from "@/views/App/Components/Button";
import Error				from "@/views/App/Components/Error";
import Back					from "@/views/App/Components/Back";

export default {
	name: 'Permissions',
	components: { Back, Error, Button },
	data: () => {
		return {
			errorMessage		: '',
			user				: null,
			examplePermissions:	JSON.stringify(
									{
										"route": [
											{
												"route": "/api/test",
												"method": "GET",
												"type": "ALLOW"
											}
										]
									}
								),
			permissions			: ''
		};
	},

	/**
	 * @brief	Loads user data
	 *
	 * @return	{Promise<void>}
	 */
	async created()
	{
		const userDataResponse	= await communicator.getUserData( this.$route.params.username ).catch(( error ) => {
			return error;
		});

		if ( userDataResponse.error )
			return this.errorMessage	= formatErrorMessage( userDataResponse.error );

		this.user			= new User( userDataResponse );
		this.permissions	= JSON.stringify( JSON.parse( this.user.getFormattedUserPermissions() ), undefined, 4 );
	},

	methods: {
		/**
		 * @brief	Changes the user permissions
		 *
		 * @details	Sorts the roles to be sent in the way that they appear
		 *
		 * @return	void
		 */
		changePermissions: async function ()
		{
			try
			{
				this.permissions	= JSON.parse( this.permissions );
			}
			catch ( e )
			{
				return this.errorMessage	= `Error Parsing JSON: ${e}`
			}

			if ( this.user === null )
				return;

			const newUser	= new User( this.user.getUserData() );
			const oldUser	= new User( this.user.getUserData() );
			if ( ! newUser.setUserPermissions( this.permissions ) )
				return;

			const updateUserResponse	= await communicator.updateUser( oldUser.getUserData(), newUser.getUserData() ).catch(( error )=> {
				return error;
			});

			if ( updateUserResponse.error )
				return this.errorMessage	= formatErrorMessage( updateUserResponse.error );
			else
				await this.$router.push( { name: 'users-user', params: { username: this.$route.params.username } } );
		}
	}
}
</script>

<style scoped>
</style>