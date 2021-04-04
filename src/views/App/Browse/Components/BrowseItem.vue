<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 hover:bg-gray-600 text-white
				cursor-pointer"
				@mouseover="show"
				@mouseleave="hover = false"
	>
		<span class="absolute left-1/4 md:left-2/4" :class="[hover === false ? 'hidden' : '']">
			<img :src="imageSrc" alt="" :class="[hover === false ? 'visible top-0 z-10' : '']" style="height: 25vh">
		</span>

		<input type="checkbox" class="w-1/6 form-checkbox h-6 w-6 inline-block md:hidden mt-3" v-if="! isBack" v-model="checked">

		<span class="fa fa-angle-double-left md:hidden fa-3x w-1/6" v-if="isBack"></span>
		<span class="fa fa-folder-open md:hidden fa-3x w-1/6" v-if="isFolder && ! isBack"></span>
		<span class="fa fa-file md:hidden fa-3x w-1/6" v-if="! isFolder && ! isBack"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-10 hidden md:inline-block" v-if="! isBack">
				<input type="checkbox" class="form-checkbox h-5 w-5 mt-3 mx-auto" v-model="checked">
			</div>

			<div class="w-full md:w-10/12 inline-block" @click="$emit( 'on-click' )">
				<p class="truncate">
					<i class="fa fa-angle-double-left mr-2 hidden md:inline-block" v-if="isBack"></i>
					<i class="fa fa-folder-open mr-2 hidden md:inline-block" v-if="isFolder && ! isBack"></i>
					<i class="fa fa-file mr-2 hidden md:inline-block" v-if="! isFolder && ! isBack"></i>
					<span v-if="! isBack" :class="{ 'text-blue-200': previewAvailable && ! isFolder }" class="font-medium text-base">{{name}}</span>
				</p>
			</div>
			<div class="w-full md:w-1/12 inline-block" @click="$emit( 'on-click' )">
				<p class="truncate" v-if="! isFolder">
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
			checked			: false,
			hoverTimeout	: null,
			imageSrc		: ''
		};
	},
	props: {
		name				: String,
		encodedURI			: String,
		fileType			: String,
		previewAvailable	: Boolean,
		size				: { type : Number,	default : 0		},
		isFolder			: { type : Boolean,	default : true	},
		isBack				: { type : Boolean,	default : false	},
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

				switch ( this.fileType )
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
	},

	watch: {
		/**
		 * @brief	Emits an `on-checked` event with the item and the checked state
		 *
		 * @return	void
		 */
		checked: function ()
		{
			this.$emit( 'on-checked', { checked: this.checked, item: this } );
		}
	}
}
</script>