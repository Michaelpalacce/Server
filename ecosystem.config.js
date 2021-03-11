module.exports	=
{
	apps :
	[
		{
			name: 'server-emulator',
			script: 'index.js',
			watch: false,
			env: require( './env' )
		},
		{
			name: "server-emulator-vue",
			script: "./node_modules/@vue/cli-service/bin/vue-cli-service.js",
			args: "serve"
		}
	]
};
