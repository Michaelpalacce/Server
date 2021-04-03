<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 hover:bg-gray-600 text-white
				cursor-pointer"
				@mouseover="show"
				@mouseleave="hover = false"
	>
		<span class="absolute right-1/4" :class="[hover === false ? 'hidden' : '']">
			<img :src="imageSrc" alt="" :class="[hover === false ? 'visible top-0 z-10' : '']" style="height: 25vh">
		</span>

		<span class="fa fa-angle-double-left md:hidden fa-3x w-1/6" v-if="isBack === true"></span>
		<span class="fa fa-folder-open md:hidden fa-3x w-1/6" v-if="isFolder === true && isBack === false"></span>
		<span class="fa fa-file md:hidden fa-3x w-1/6" v-if="isFolder === false && isBack === false"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-5/6 inline-block">
				<p class="truncate">
					<i class="fa fa-angle-double-left mr-2 hidden md:inline-block" v-if="isBack === true"></i>
					<i class="fa fa-folder-open mr-2 hidden md:inline-block" v-if="isFolder === true && isBack === false"></i>
					<i class="fa fa-file mr-2 hidden md:inline-block" v-if="isFolder === false && isBack === false"></i>
					<span v-if="isBack === false">{{name}}</span>
				</p>
			</div>
			<div class="w-full md:w-1/6 inline-block">
				<p class="truncate" v-if="isFolder === false">
					<span class="md:hidden mr-2">Size:</span> {{ bytesToSize( size ) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import communicator	from "@/app/main/api/communicator";

export default {
	name: "BrowseItem",
	data	: function ()
	{
		return {
			hover			: false,
			hoverTimeout	: null,
			imageSrc		: ''
		};
	},
	props: {
		name		: String,
		encodedURI	: String,
		size		: {
			type	: Number,
			default	: 0
		},
		isFolder	: {
			type	: Boolean,
			default	: true
		},
		isBack		: {
			type	: Boolean,
			default	: false
		},
		type		: String
	},

	methods: {
		/**
		 * @brief	Shows the image after 250 milliseconds
		 *
		 * @details	Will only show the thumbnail if the user is still hovering after 250 milliseconds
		 *
		 * @return	void
		 */
		show: function ()
		{
			this.hover	= true;
			setTimeout(() => {
				if ( ! this.hover )
					return;

				switch ( this.type )
				{
					case 'image':
						this.imageSrc	= `${communicator.getApiUrl()}/file/data?file=${this.encodedURI}`;
						break;
				}
			}, 250 );
		},

		/**
		 * @brief	Converts bytes to KB,MB,GB,TB
		 *
		 * @param	{Number} bytes
		 *
		 * @returns	String
		 */
		bytesToSize( bytes )
		{
			const sizes	= ['B', 'KB', 'MB', 'GB', 'TB'];
			if ( bytes === 0 )
				return '0 B';

			const i	= parseInt( Math.floor( Math.log( bytes ) / Math.log( 1024 ) ) );

			return Math.round( bytes / Math.pow( 1024, i ), 2 ) + ' ' + sizes[i];
		}
	}
}
</script>