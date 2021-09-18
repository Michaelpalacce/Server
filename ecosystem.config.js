const envFile	= require( './ensure_env_file' );

module.exports	=
{
	apps :
	[
		{
			name: 'server-emulator',
			script: `${__dirname}/index.js`,
			watch: false,
			env: require( envFile )
		}
	]
};
