<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 hover:bg-gray-600 text-white
				cursor-pointer"
				@mouseover="show"
				@mouseleave="hover = false"
				@click="click"
		:class="{ 'bg-gray-600': checked }"
	>
		<span class="absolute left-1/4 md:left-2/4 z-10" :class="[hover === false ? 'hidden' : '']">
			<img :src="imageSrc" alt="" :class="[hover === false ? 'visible' : '']" style="height: 25vh; top: -50px;">
		</span>

		<input type="checkbox" class="flex-none form-checkbox h-6 w-10 inline-block md:hidden mt-3" v-if="checkboxVisible" v-model="checked">

		<span class="fa fa-folder-open md:hidden fa-3x w-1/6" v-if="isFolder"></span>
		<span class="fa fa-file md:hidden fa-3x w-1/6" v-if="! isFolder"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="md:w-10 hidden md:inline-block" v-if="checkboxVisible">
				<input type="checkbox" class="form-checkbox h-5 w-5 mt-3 mx-auto" v-model="checked">
			</div>

			<div class="w-full md:w-7/12 inline-block">
				<p class="truncate">
					<i class="fa fa-folder-open mr-2 hidden md:inline-block" v-if="isFolder"></i>
					<i class="fa fa-file mr-2 hidden md:inline-block" v-if="! isFolder"></i>
					<span :class="{ 'text-blue-200': previewAvailable && ! isFolder }" class="font-medium text-base">{{initialName}}</span>
				</p>
			</div>
			<div class="w-full md:w-3/12 inline-block">
				<p class="truncate">
					<span class="md:hidden mr-2">Modified:</span> {{ mTime.replace( 'T', ' ' ).substr( 0, 19 ) }}
				</p>
			</div>
			<div class="w-full md:w-1/12 inline-block">
				<p class="truncate">
					<span class="md:hidden mr-2">Size:</span> {{ isFolder ? '--' : bytesToSize( size ) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BrowseItem",
	data	: function ()
	{
		return {
			hover			: false,
			checked			: false,
			hoverTimeout	: null,
			name			: this.initialName,
			encodedURI		: this.initialEncodedURI,
			imageSrc		: ''
		};
	},
	props: {
		id					: String,
		initialName			: String,
		initialEncodedURI	: String,
		fileType			: String,
		previewAvailable	: Boolean,
		size				: { type : Number,	default : 0		},
		mTime				: { type : String,	default : ''	},
		isFolder			: { type : Boolean,	default : true	},
		isBack				: { type : Boolean,	default : false	},
		checkboxVisible		: { type : Boolean,	default : true	}
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
						this.imageSrc	= `/api/browse/file/data?file=${this.encodedURI}`;
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
		},

		/**
		 * @brief	Change the item's name
		 *
		 * @details	Only renames the item if the new name is a string
		 *
		 * @param	{String} name
		 *
		 * @return	void
		 */
		rename( name )
		{
			if ( typeof name === 'string' )
				this.name	= name;
		},

		/**
		 * @brief	On click event that emits `on-click` only when not clicking on a checkbox
		 *
		 * @param	{Event} event
		 *
		 * @return	void
		 */
		click( event )
		{
			if ( event.target.type !== 'checkbox' )
				this.$emit( 'on-click' );
		}
	},

	watch: {
		/**
		 * @brief	Emits an `on-checked` event with the item and the checked state
		 *
		 * @return	void
		 */
		checked: function ( value ) {
			this.$emit( 'on-checked', { checked: this.checked, item: this } );
		}
	}
}
</script>
