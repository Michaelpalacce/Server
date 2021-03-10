module.exports	=
{
	apps :
	[
		{
			name: 'server-emulator',
			script: 'index.js',
			watch: false,
			env: require( './env' )
		}
	]
};
