<template>
	<div
		class="text-white text-sm lg:text-base bg-gray-700 inline-block w-full fixed bottom-0 h-8"
	>
		<p class="text-center">
			Current version:
			<span class="text-yellow-500">{{ currentVersion }}</span>.
			Latest version:
			<a href="https://github.com/Michaelpalacce/Server">
				<span :class="`${currentVersion !== latestVersion ? 'text-red-500' : 'text-yellow-500' }`">
					{{ latestVersion }}
				</span>
			</a>
		</p>
	</div>
</template>

<script>
import communicator	from "@/app/main/api/communicator";

/**
 * One day in MS
 */
const DEFAULT_CHECK_INTERVAL_MS	= 86400000;

export default {
	name: "Footer",
	data : function () {
		return {
			latestVersion: localStorage.latestVersion,
			currentVersion: localStorage.currentVersion
		};
	},
	/**
	 * Fetches and displays the latest version against the current. Will do this once a day
	 *
	 * @return	{Promise<void>}
	 */
	async created() {
		if ( ! localStorage.latestCheck || localStorage.latestCheck < Date.now() - DEFAULT_CHECK_INTERVAL_MS ) {
			const latestResponse	= await communicator.getLatestVersion();
			const currentResponse	= await communicator.getCurrentVersion();
			if ( latestResponse.status === 200 && currentResponse.status === 200 ) {
				this.latestVersion	= localStorage.latestVersion	= latestResponse.data;
				this.currentVersion	= localStorage.currentVersion	= currentResponse.data;
			}
		}
	}
}
</script>

<style scoped>

</style>