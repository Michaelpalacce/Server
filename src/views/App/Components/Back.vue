<template>
	<div class="flex
				px-4 py-6 md:py-4
				md:block w-full
				border-b border-gray-600 hover:bg-gray-600 text-white
				cursor-pointer"
				@click="$emit( 'on-click' )"
	>
		<span class="fa fa-angle-double-left md:hidden fa-3x w-1/6"></span>

		<div class="flex flex-wrap md:block md:w-full w-5/6 text-xs md:text-base px-5 md:px-0">
			<div class="w-full md:w-full inline-block">
				<p class="truncate">
					<i class="fa fa-angle-double-left mr-2 hidden md:inline-block"></i>
					<span class="font-medium text-base ml-10">{{ backValue }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name	: 'Back',
	props	: {
		backValue: {
			type: String,
			default: ''
		}
	}
}
</script>
