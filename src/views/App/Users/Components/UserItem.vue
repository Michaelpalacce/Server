<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 hover:bg-gray-600 text-white
				cursor-pointer"
				@click="$emit( 'on-click' )"
	>
		<span class="fa fa-user md:hidden fa-2x md:fa-3x w-1/6" ></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-full inline-block">
				<p class="truncate">
					<i class="fa fa-user mr-2 hidden md:inline-block" ></i>
					<span class="font-medium text-base">{{name}}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import communicator	from "@/app/main/api/communicator";

export default {
	name	: 'UserItem',
	data	: function ()
	{
		return {
			name	: this.initialName,
		};
	},
	props: {
		initialName	: String,
	},

	methods: {
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
		}
	}
}
</script>