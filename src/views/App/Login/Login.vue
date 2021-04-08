<template>
	<div class="bg-gray-600 text-white rounded px-8 pt-6 pb-8 mb-4 flex flex-col lg:w-1/3 lg:m-auto">
		<div v-if="errorMessage !== ''" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
			<span class="block sm:inline">{{errorMessage}}</span>
			<span @click="setError( '' )" class="absolute top-0 bottom-0 right-0 px-4 py-3"><svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg></span>
		</div>
		<div class="mb-4">
			<label class="block text-grey-darker text-sm font-bold mb-2" for="username">
				Username
			</label>
			<input v-on:keyup.enter="signIn" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600" id="username" v-model="username" type="text" placeholder="Username">
		</div>
		<div class="mb-6">
			<label class="block text-grey-darker text-sm font-bold mb-2" for="password">
				Password
			</label>
			<input v-on:keyup.enter="signIn" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600" v-model="password" id="password" type="password" placeholder="******************">
		</div>
		<div class="flex items-center justify-between">
			<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" type="button" @click="signIn">
				Sign In
			</button>
		</div>
	</div>
</template>

<script>
import communicator	from "@/app/main/api/communicator";
import { access }	from "@/app/main/utils/utils";

export default {
	name: 'Login',
	data: () => {
		return {
			username: '',
			password: '',
			errorMessage: ''
		};
	},
	/**
	 * @brief	On creation if the user has credentials, redirect to the dashboard
	 */
	created: function () {
		if ( communicator.hasCredentials() )
			this.$router.push( 'dashboard' );
	},
	methods: {
		/**
		 * @brief	Signs the User in
		 *
		 * @details	This will display an error in case of an error and will clean the error at the beginning
		 * 			If everything is successful, the user will be redirected to the dashboard
		 * 			On success, set the name in localStorage
		 *
		 * @return	void
		 */
		signIn()
		{
			this.setError();

			communicator.login( this.username, this.password ).then(( response )=>{
				this.$router.push( 'dashboard' );
				this.emitter.emit( 'user.credentials' );
			}).catch(( error ) => {
				this.setError( access( () => error.response.data.error.message, 'Invalid Credentials' ) );
			});
		},

		/**
		 * @brief	Sets an error in the login box
		 *
		 * @param	{String} error
		 *
		 * @return	void
		 */
		setError( error = '' )
		{
			this.errorMessage	= error;
		}
	}
}
</script>
