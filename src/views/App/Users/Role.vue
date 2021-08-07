<template>
	<div class="w-full">
		<Back @click="$router.push( { name: 'users' } )" class="mb-10"/>
		<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>

		<div class="text-center text-white">
			<p class="text-base mb-5">Feel free to edit the permissions bellow. For more information: <span class="text-sm text-blue-400"><a href="https://github.com/Michaelpalacce/Server/blob/master/README.md">Docs</a></span></p>
			<p class="text-sm">Note: If you want to use regex, you have to change the value from: <span class="font-bold">`route: /^\/users?(.+)/`</span> to <span class="font-bold">`route: { regexp: { source: "^\\/users?(.+)", flags: "" } }`</span></p>
		</div>

		<textarea v-model="permissions" class="w-full h-64 md:w-2/3 md:h-96 mx-auto my-12 block bg-gray-800 p-5 text-white" cols="50" rows="15"></textarea>
		<p class="text-white text-center text-xl text-bold">Add sections</p>
		<div class="flex justify-center">
			<Button class="md:ml-5 ml-1" @click="addAllowPermission" text="Allow"/>
			<Button class="md:ml-5 ml-1" @click="addDenyPermission" text="Deny"/>
			<Button class="md:ml-5 ml-1" @click="addRegexPermission" text="Regex"/>
		</div>
		<div class="flex justify-center mt-5">
			<Button @click="changePermissions" text="Change"/>
		</div>
	</div>
</template>

<script>
import Back														from "@/views/App/Components/Back";
import communicator												from "@/app/main/api/communicator";
import Button													from '../Components/Button.vue';
import Error													from "../Components/Error.vue";
import { formatPermissions, parsePermissions, mixPermissions }	from "../../../../api/main/acls/permissions_helper";

export default {
	name: 'UsersRole',

	components: { Back, Button, Error },

	data: () => {
		return {
			errorMessage				: '',
			exampleAllowPermissions:	{ route: "/api", method: "GET", type: "ALLOW" },
			exampleDenyPermissions:		{ route: "/api", method: "GET", type: "DENY" },
			exampleRegexPermission:		{ regexp: { source: "^\\/users?(.+)", flags: "" }, method: "GET", type: "ALLOW" },
			roleName					: '',
			permissions					: ''
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
		 * @brief	Loads the role data
		 *
		 * @return	void
		 */
		async loadData()
		{
			const allRolesResponse	= await communicator.getRoles().catch(( error ) => {
				return error;
			});

			if ( allRolesResponse.error )
				return this.errorMessage	= formatErrorMessage( allRolesResponse.error );


			const role	= Object.values( allRolesResponse ).reduce( ( accumulator, currentValue ) => {
				if ( currentValue.name === this.$route.params.role )
					accumulator	= currentValue;

				return accumulator;
			});

			this.roleName		= role.name;
			this.permissions	= JSON.stringify( JSON.parse( formatPermissions( role.permissions ) ), undefined, 4 );
		},

		/**
		 * @brief	Changes the current permission if valid
		 *
		 * @returns	void
		 */
		async changePermissions()
		{
			try
			{
				this.permissions	= JSON.parse( this.permissions );
			}
			catch ( e )
			{
				return this.errorMessage	= `Error Parsing JSON: ${e}`
			}

			alert( 'Still work in progress!' );

			if ( false )
				return this.errorMessage	= 'Error';
			else
				await this.$router.push( { name: 'users' } );
		},

		/**
		 * @brief	Adds an allow permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addAllowPermission()
		{

		},

		/**
		 * @brief	Adds a deny permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addDenyPermission()
		{

		},

		/**
		 * @brief	Adds a regex permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addRegexPermission()
		{

		},
	}
}
</script>

<style scoped>

</style>