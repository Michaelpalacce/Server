<template>
	<BrowseItem name="Back" :isFolder="true" @click="$router.go( -1 )" :isBack="true"/>

	<div class="rounded-t-lg m-5 mx-auto bg-gray-700 text-gray-200 px-5">
		<span class="text-xl flex justify-center items-center mx-auto mb-10" >{{itemName}}</span>

		<video controls :class="{ hidden: textSrc === '' }" id="modalPreviewVideo"></video>

		<video controls :class="{ hidden: audioSrc === '' }" id="modalPreviewAudio"></video>

		<div :class="{ hidden: textSrc === '' }" :data-src="textSrc" id="modalPreviewText"></div>

		<img :class="{ hidden: imageSrc === '' }" class="flex justify-center items-center mx-auto" style="height: 75vh" :src="imageSrc" alt="" id="modalPreviewImage">
	</div>
</template>

<script>
import BrowseItem	from "@/views/App/Browse/Components/BrowseItem";
import communicator	from "@/app/main/api/communicator";

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
	created()
	{
		this.itemName	= decodeURIComponent( this.$route.query.name );
		const item		= this.$route.query.item;

		switch ( this.$route.query.type )
		{
			case 'image':
				this.imageSrc	= `${communicator.getApiUrl()}/file/data?file=${item}`;
				break;
			case 'audio':
				this.audioSrc	= item;
				break;
			case 'text':
				this.textSrc	= item;
				break;
			case 'video':
				this.videoSrc	= item;
				break;
		}

	}
}
</script>

<style scoped>

</style>