<template>
	<Back @click="$router.push( { name: 'users-user', params: { username: $route.params.username } } )" class="mb-10"/>
	<Error :errorMessage="errorMessage" @clear="errorMessage = ''" class="mb-5"/>

	<div class="m-5" @drop="onDrop" @dragover.prevent @dragenter.prevent >
		<Message
				message="You can drag and drop to move the order of the roles (not working on mobile, you have to manually edit them)."
				class="mb-5"/>

		<div v-for="roleName in rolesOrder" class="my-16 text-white">
			<div draggable="true" @dragstart="startDrag( $event, roleName )" class="flex">
				<p class="text-xl w-1/2">
					<input type="checkbox" :value="roleName" :checked="checkedRoles.includes( roleName )" v-model="checkedRoles" :ref="roleName">
					<span class="mx-5">{{roleName}}</span>
				</p>

				<Button @click="roles[roleName].opened = ! roles[roleName].opened" text="Permissions" />
			</div>

			<pre v-if="roles[roleName].opened" class="text-base">{{ JSON.stringify( roles[roleName].permissions, undefined, 2 ) }}</pre>
		</div>

		<div class="flex justify-center">
			<Button @click="changeRoles" text="Change"/>
			<Button @click="editOrder" text="Edit Order" class="sm:hidden"/>
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
import Message				from "@/views/App/Components/Message";

export default {
	name: 'Roles',
	components: { Message, Back, Error, Button },
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
	 * @brief	Loads user data
	 *
	 * @return	{Promise<void>}
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
			if ( this.user === null )
				return;

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
				await this.$router.push( { name: 'users-user', params: { username: this.$route.params.username } } );
		},

		/**
		 * @brief	Edits the roles order. Used for mobile since drag and drop does not work there
		 *
		 * @details	It prompts the user for a new order. It will check if there are any new entries and filter them if so.
		 * 			In case the user clicks back, nothing will be changed
		 *
		 * @return	void
		 */
		editOrder()
		{
			const newOrder	= prompt( 'Order:', this.rolesOrder.join( ',' ) );

			if ( ! newOrder )
				return;

			this.rolesOrder	= newOrder.split( ',' ).filter( role => this.rolesOrder.includes( role ) );
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
</style>
