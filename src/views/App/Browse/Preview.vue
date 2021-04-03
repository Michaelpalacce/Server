<template>
	<div class="rounded-t-lg mx-5 mt-2 bg-gray-700 text-gray-200 px-5">
		<BrowseItem name="Back" :isFolder="true" @click="$router.go( -1 )" :isBack="true" class="mb-1"/>

		<span class="flex justify-center items-center mx-auto mb-10 text-md md:text-xl" >Name: {{itemName}}</span>

		<video controls class="flex justify-center items-center mx-auto" :class="{ hidden: videoSrc === '' }" :src="videoSrc" ></video>

		<video controls class="flex justify-center items-center mx-auto" :class="{ hidden: audioSrc === '' }" :src="audioSrc"></video>

		<span :class="{ hidden: textSrc === '' }" v-html="textSrc"></span>

		<img :class="{ hidden: imageSrc === '' }" class="flex justify-center items-center mx-auto h-auto w-auto" style="max-height: 75vh" :src="imageSrc" alt="">
	</div>
</template>

<script>
import BrowseItem	from "@/views/App/Browse/Components/BrowseItem";
import communicator	from "@/app/main/api/communicator";
import axios		from "axios";

export default {
	name: "Preview",
	components: {
		BrowseItem
	},
	data: () => {
		return {
			itemName	: '',
			textSrc		: '',
			imageSrc	: '',
			videoSrc	: '',
			audioSrc	: ''
		};
	},

	async created()
	{
		this.itemName	= decodeURIComponent( this.$route.query.name );
		const item		= this.$route.query.item;
		const type		= this.$route.query.type;
		const url		= `${communicator.getApiUrl()}/file/data?file=${item}`;

		switch ( type )
		{
			case 'image':
				this.imageSrc	= url;
				break;
			case 'audio':
				this.audioSrc	= url;
				break;
			case 'text':
				const response	= await axios.get( url, {}, { headers: communicator.getAuthHeaders() } ).catch( console.log )

				let result		= response.data;
				result			= result.replace( / /g, '&nbsp;' );
				result			= result.replace( /\t/g, '&emsp;' );
				result			= result.replace( /\n/g, '<br>' );

				this.textSrc	= result;
				break;
			case 'video':
				this.videoSrc	= url;
				break;
		}

	}
}
</script>

<style scoped>

</style>