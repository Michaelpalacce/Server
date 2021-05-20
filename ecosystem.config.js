module.exports	=
{
	apps :
	[
		{
			name: 'server-emulator',
			script: `${__dirname}/index.js`,
			watch: false,
			env: require( './env' )
		}
	]
};
