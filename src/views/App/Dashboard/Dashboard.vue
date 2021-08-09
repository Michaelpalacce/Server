<template>
	<div class="mt-10 text-white text-center">
		<h1 class="text-5xl">Welcome {{name}}!</h1>
		<Divider />
	</div>

	<div class="mt-20">
		<p class="text-white cursor-pointer mx-auto text-center" @click="browseShown = !browseShown">
			<span class="inline-block text-2xl mb-5">Browse Favorites</span>
			<span class="inline-block ml-2 chevron"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg></span>
		</p>

		<transition name="browse" >
			<div class="lg:w-1/2 mx-auto w-full" v-if="browseShown && browseFavorites.length > 0" >
				<BrowseItem
					class="mb-5 inline-block"

					v-for="item in browseFavorites"

					:key="item.name"
					:initialName="item.name"
					:isFolder="item.isDir"
					:fileType="item.fileType"
					:initialEncodedURI="item.encodedURI"
					:previewAvailable="item.previewAvailable"
					:size="item.size"
					:checkboxVisible="false"
					@on-click="browseItemClick( item )"
				/>
			</div>
		</transition>
	</div>
</template>

<script>
import communicator	from '../../../app/main/api/communicator';
import BrowseItem	from '../Browse/Components/BrowseItem';
import Button		from '../Components/Button';
import Divider		from '../Components/Divider';
import TitleSection	from '../Users/Components/TitleSection';

export default {
	name		: 'Dashboard',
	components	: { Divider, BrowseItem, Button, TitleSection },
	data		: () => {
		return {
			name			: localStorage.name,
			browseShown		: true,
			browseFavorites	: []
		};
	},

	async created()
	{
		const getDashboardResponse	= await communicator.getDashboard().catch( error => error );

		if ( getDashboardResponse.error )
			return;

		this.browseFavorites	= getDashboardResponse.browseFavorites;
	},

	methods: {
		browseItemClick( item )
		{
			if ( item.isDir )
				this.$router.push(
					{
						path	: 'browse',
						query	: {
							directory	: item.encodedURI
						}
					}
				);
			else if ( item.previewAvailable )
				this.$router.push(
					{
						path	: 'preview',
						query	: {
							item	: item.encodedURI,
							type	: item.fileType,
							name	: encodeURIComponent( item.name )
						}
					}
				);
		}
	}
}
</script>

<style scoped>
.browse-enter-active,
.browse-leave-active {
	transition: opacity .25s ease;
}

.browse-enter-from,
.browse-leave-to {
	opacity: 0;
}
</style>