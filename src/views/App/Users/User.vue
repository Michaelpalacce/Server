<template>
	<div class="rounded-t-lg m-5 mx-auto text-gray-200 px-5 text-2xl">
		<Back @click="$router.go( -1 )" class="mb-10"/>

		<div class="px-2 max-w-5xl mx-auto">
			<Error :errorMessage="errorMessage" @clear-click="errorMessage = ''" class="mb-5"/>

			<TitleSection title="User settings" />

			<div class="flex w-full">
				<div class="w-10/12 flex flex-col">
					<span class="w-full">Username</span>
					<span class="w-full text-base">{{username}}</span>
				</div>

				<div class="w-2/12">
					<Button text="Change"/>
				</div>
			</div>
			<Divider />

			<div class="flex w-full">
				<div class="w-10/12 flex flex-col">
					<span class="w-full">Change Password</span>
					<span class="w-full text-base">Password must be more than 6 characters</span>
				</div>

				<div class="w-2/12">
					<Button text="Change"/>
				</div>
			</div>
			<Divider />

			<TitleSection title="Permissions" class="mt-32"/>
			<div class="flex w-full">
				<div class="w-10/12 flex flex-col">
					<span class="w-full">Roles</span>
					<span class="w-full text-base">{{ user !== null ? user.roles.join( ',' ) : '' }}</span>
				</div>

				<div class="w-2/12">
					<Button text="Change"/>
				</div>
			</div>
			<Divider />
			<div class="flex w-full">
				<div class="w-10/12 flex flex-col">
					<span class="w-full">Permissions</span>
					<span class="w-full text-base max-h-64 overflow-y-auto" v-html="permissions"></span>
				</div>

				<div class="w-2/12">
					<Button text="Change"/>
				</div>
			</div>
			<Divider />

			<TitleSection title="Browse Module" class="mt-32"/>

			<div class="flex w-full">
				<div class="w-10/12 flex flex-col">
					<span class="w-full">Route</span>
					<span class="w-full text-base">{{ user !== null ? user.getBrowseMetadata().getRoute() : '' }}</span>
				</div>

				<div class="w-2/12">
					<Button text="Change"/>
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
	name: 'User',

	components: {Error, TitleSection, Button, Divider, Back },

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
			this.username	= this.$route.query.username || null;

			if ( this.username === null )
				return this.$router.push( 'users' );

			const userDataResponse	= await communicator.getUserData( this.username ).catch(( error ) => {
				return error;
			});

			if ( userDataResponse.error )
				return this.errorMessage	= formatErrorMessage( userDataResponse.error );

			this.user			= new User( userDataResponse );
			this.permissions	= `<pre>${JSON.stringify( this.user.getPermissions(), undefined, 2 )}</pre>`
		}
	}
}
</script>

<style scoped>

</style>