<template>
	<div class="rounded-t-lg mx-5 mt-2 bg-gray-700 text-gray-200 px-5">
		<Back @click="$router.go( -1 )" class="mb-1"/>

		<span class="flex justify-center items-center mx-auto mb-10 text-md md:text-xl" >Name: {{itemName}}</span>

		<video controls class="flex justify-center items-center mx-auto" :class="{ hidden: videoSrc === '' }" :src="videoSrc" ></video>

		<video controls class="flex justify-center items-center mx-auto" :class="{ hidden: audioSrc === '' }" :src="audioSrc"></video>

		<div :class="{ hidden: textSrc === '' }">
			<pre><code>{{ textSrc }}</code></pre>
		</div>

		<img :class="{ hidden: imageSrc === '' }" class="flex justify-center items-center mx-auto h-auto w-auto" style="max-height: 75vh" :src="imageSrc" alt="">
	</div>
</template>

<script>
import axios	from "axios";
import hljs		from 'highlight.js';
import Back		from "@/views/App/Components/Back";

export default {
	name: "Preview",
	components: {
		Back
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
		const url		= `/api/browse/file/data?file=${item}`;

		switch ( type )
		{
			case 'image':
				this.imageSrc	= url;
				break;
			case 'audio':
				this.audioSrc	= url;
				break;
			case 'text':
				const response	= await axios.get( url,{ withCredentials: true } ).catch( console.log )

				let result		= response.data;
				if ( typeof result !== 'string' )
					result	= JSON.stringify( result, null, 4 );

				this.textSrc	= result;
				break;
			case 'video':
				this.videoSrc	= url;
				break;
		}
	},

	watch: {
		textSrc : function () {
			setTimeout(() => {
				hljs.highlightAll();
			}, 0 );
		}
	}
}
</script>

<style scoped>

</style>
