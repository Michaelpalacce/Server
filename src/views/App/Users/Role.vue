<template>
	<div class="w-full">
		<Back @click="$router.push( { name: 'users' } )" class="mb-10"/>
		<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>

		<p class="text-5xl text-white text-center mb-10" v-if="!isNewRole">{{ roleName }}</p>

		<div class="text-center text-white">
			<p class="text-base mb-5">Feel free to edit the permissions bellow. For more information: <span class="text-sm text-blue-400"><a href="https://github.com/Michaelpalacce/Server/blob/master/README.md">Docs</a></span></p>
		</div>

		<textarea v-model="permissions" class="w-full h-64 md:w-2/3 md:h-96 mx-auto my-12 block bg-gray-800 p-5 text-white" cols="50" rows="15"></textarea>
		<p class="text-white text-center text-xl text-bold">Add sections</p>
		<div class="flex justify-center">
			<Button class="md:mx-4 mx-1" @click="addAllowPermission" text="Allow"/>
			<Button class="md:mx-4 mx-1" @click="addDenyPermission" text="Deny"/>
			<Button class="md:mx-4 mx-1" @click="addRegexPermission" text="Regex"/>
		</div>
		<div class="flex justify-center mt-5">
			<Button @click="saveRole" text="Save Role" v-if="isNewRole"/>
			<Button @click="changeRole" text="Change" v-else/>
			<Button @click="deleteRole" v-if="! isNewRole" text="Delete Role" />
		</div>
	</div>
</template>

<script>
import Back														from "@/views/App/Components/Back";
import communicator												from "@/app/main/api/communicator";
import Button													from '../Components/Button.vue';
import Error													from "../Components/Error.vue";
import { formatPermissions, parsePermissions, mixPermissions }	from "../../../../api/main/acls/permissions_helper";
import formatErrorMessage										from '../../../app/main/utils/error_message_format';

export default {
	name: 'UsersRole',

	components: { Back, Button, Error },

	data: () => {
		return {
			errorMessage				: '',
			exampleAllowPermissions:	{ route: "/api", method: "GET", type: "ALLOW" },
			exampleDenyPermissions:		{ route: "/api", method: "GET", type: "DENY" },
			exampleRegexPermission:		{ route: { regexp: { source: "^\\/api?(.+)", flags: "" } }, method: "GET", type: "ALLOW" },
			permissions					: '',
			isNewRole					: false,
			roleName					: ''
		};
	},

	/**
	 * @brief	When the component is created, load the data
	 *
	 * @return	void
	 */
	async created()
	{
		const roleName	= this.$route.params.role || '';
		this.isNewRole	= roleName === '';
		this.roleName	= roleName;

		if ( ! this.isNewRole )
			await this.loadData();
		else
		{
			this.permissions	= JSON.stringify( { route: [this.exampleAllowPermissions]}, undefined, 4 );
		}
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
				if ( currentValue.name === this.roleName )
					accumulator	= currentValue;

				return accumulator;
			});

			this.permissions	= JSON.stringify( JSON.parse( formatPermissions( role.permissions ) ), undefined, 4 );
		},

		/**
		 * @brief	Changes the current role if valid
		 *
		 * @returns	void
		 */
		async changeRole()
		{
			let permissions;
			try
			{
				permissions	= JSON.parse( this.permissions );
			}
			catch ( e )
			{
				return this.errorMessage	= `Error Parsing JSON: ${e}`
			}

			const updateRoleResponse	= await communicator.updateRole( this.roleName, permissions ).catch(( error ) => {
				return error;
			});

			if ( updateRoleResponse.error )
				return this.errorMessage	= formatErrorMessage( updateRoleResponse.error );
		},

		/**
		 * @brief	Deletes the role
		 *
		 * @returns	void
		 */
		async deleteRole()
		{
			const reallyDelete	= confirm( `Are you sure you want to delete ${this.roleName}?` );

			if ( ! reallyDelete )
				return;

			const deleteRoleResponse	= await communicator.deleteRole( this.roleName ).catch(( error ) => {
				return error;
			});

			if ( deleteRoleResponse.error )
				return this.errorMessage	= formatErrorMessage( deleteRoleResponse.error );
			else
				await this.$router.push( { name: 'users' } );
		},

		/**
		 * @brief	Saves a new role
		 *
		 * @returns	void
		 */
		async saveRole()
		{
			const roleName	= prompt( 'Enter role name' );

			if ( roleName.length === 0 )
				return this.errorMessage	= 'Role name cannot be empty';

			let permissions;
			try
			{
				permissions	= JSON.parse( this.permissions );
			}
			catch ( e )
			{
				return this.errorMessage	= `Error Parsing JSON: ${e}`
			}

			const newRoleResponse	= await communicator.addRole( roleName, permissions ).catch(( error ) => {
				return error;
			});

			if ( newRoleResponse.error )
				return this.errorMessage	= formatErrorMessage( newRoleResponse.error );
			else
			{
				this.isNewRole	= false;
				this.roleName	= roleName;
			}
		},

		/**
		 * @brief	Adds an allow permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addAllowPermission()
		{
			const newPermissions	= JSON.parse( this.permissions );
			newPermissions.route.push( this.exampleAllowPermissions );

			this.permissions	= JSON.stringify( newPermissions, undefined, 4 );
		},

		/**
		 * @brief	Adds a deny permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addDenyPermission()
		{
			const newPermissions	= JSON.parse( this.permissions );
			newPermissions.route.push( this.exampleDenyPermissions );

			this.permissions	= JSON.stringify( newPermissions, undefined, 4 );
		},

		/**
		 * @brief	Adds a regex permission to the currently existing route permissions
		 *
		 * @returns	void
		 */
		async addRegexPermission()
		{
			const newPermissions	= JSON.parse( this.permissions );
			newPermissions.route.push( this.exampleRegexPermission );

			this.permissions	= JSON.stringify( newPermissions, undefined, 4 );
		},
	}
}
</script>

<style scoped>

</style>