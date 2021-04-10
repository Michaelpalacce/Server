<template>

</template>

<script>
import { parsePermissions }	from "@/../api/main/acls/permissions_helper"
import communicator			from "@/app/main/api/communicator";


export default {
	name: 'Roles',

	async created()
	{
		console.log( parsePermissions( JSON.stringify( await communicator.getRoles() ) ) );
	},
}
</script>

<style scoped>

</style>