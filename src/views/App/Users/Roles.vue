<template>
	<Back @click="$router.go( -1 )" class="mb-10"/>
	<Error :errorMessage="errorMessage" @clear-click="errorMessage = ''" class="mb-5"/>

	<div class="m-10" @drop="onDrop" @dragover.prevent @dragenter.prevent>
		<div v-for="roleName in rolesOrder" class="mb-24 text-white">
			<div draggable="true" @dragstart="startDrag( $event, roleName )" class="flex w-full draggable">
				<span class="text-xl w-1/2">
					<input type="checkbox" :value="roleName" :checked="checkedRoles.includes( roleName )" v-model="checkedRoles" :ref="roleName">
					<span class="mx-5">{{roleName}}</span>
				</span>

				<Button @click="roles[roleName].opened = ! roles[roleName].opened" text="Toggle Permissions" />

				<pre class="overflow-y-auto block" v-if="roles[roleName].opened">
				{{ JSON.stringify( roles[roleName].permissions, undefined, 2 ) }}
			</pre>
			</div>
		</div>

		<Button @click="changeRoles" text="Change" class="w-2/12"/>
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
	name: 'Roles',
	components: { Back, Error, Button },
	data: () => {
		return {
			roles			: {},
			errorMessage	: '',
			user			: null,
			rolesOrder		: [],
			checkedRoles	: []
		};
	},

	/**
	 * @brief	Loads user data on created
	 * @return {Promise<void>}
	 */
	async created()
	{
		const rolesResponse		= await communicator.getRoles().catch(( error ) => {
			return error;
		});

		if ( rolesResponse.error )
			return this.errorMessage	= formatErrorMessage( rolesResponse.error );

		const userDataResponse	= await communicator.getUserData( this.$route.params.username ).catch(( error ) => {
			return error;
		});

		if ( userDataResponse.error )
			return this.errorMessage	= formatErrorMessage( userDataResponse.error );

		this.roles			= rolesResponse;
		this.user			= new User( userDataResponse );

		this.checkedRoles	= this.user.getRoles();

		// First convert the object to an array
		// Filter out anything that is part of the checked roles
		// Map it to get the name instead of the role object
		this.rolesOrder		= [...this.checkedRoles, ...Object.entries( this.roles ).filter( role => ! this.checkedRoles.includes( role[1].name ) ).map( role => role[0] )];
	},

	methods: {
		/**
		 * @brief	Event triggered when the user starts dragging a role
		 *
		 * @return	void
		 */
		startDrag: function( event, roleName )
		{
			event.dataTransfer.dropEffect		= 'move';
			event.dataTransfer.effectAllowed	= 'move';
			event.dataTransfer.setData( 'role', roleName );
		},

		/**
		 * @brief	Event triggered when the user drops a role
		 *
		 * @return	void
		 */
		onDrop: function( event )
		{
			const role		=  event.dataTransfer.getData( 'role' );
			const newOrder	= [];

			for ( const ref in this.$refs )
				newOrder.push( [ref, ref === role ? event.clientY : this.$refs[ref].offsetTop] );

			this.rolesOrder	= newOrder.sort( ( a, b ) => a[1] - b[1] ).map( ( role ) => role[0] );
		},

		/**
		 * @brief	Changes the user roles
		 *
		 * @details	Sorts the roles to be sent in the way that they appear
		 *
		 * @return	void
		 */
		changeRoles: async function ()
		{
			const roles		= this.sortArrayByOtherArray( this.checkedRoles, this.rolesOrder );

			const newUser	= new User( this.user.getUserData() );
			const oldUser	= new User( this.user.getUserData() );
			if ( ! newUser.setRoles( roles ) )
				return;

			const updateUserResponse	= await communicator.updateUser( oldUser.getUserData(), newUser.getUserData() ).catch(( error )=> {
				return error;
			});

			if ( updateUserResponse.error )
				return this.errorMessage	= formatErrorMessage( updateUserResponse.error );
			else
				this.$router.go( -1 );
		},

		/**
		 * @brief	Sorts one array using another as a sorter
		 *
		 * @param	{Array} arrayOne
		 * @param	{Array} arrayTwo
		 *
		 * @return	{Array}
		 */
		sortArrayByOtherArray( arrayOne, arrayTwo )
		{
			return arrayOne.slice().sort( ( a, b ) => arrayTwo.indexOf( a ) - arrayTwo.indexOf( b ) );
		}
	}
}
</script>

<style scoped>
.draggable:d
</style>