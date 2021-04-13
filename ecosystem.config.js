const path			= require( 'path' );
const projectDir	= path.parse( require.main.filename ).dir;

module.exports	=
{
	apps :
	[
		{
			name: 'server-emulator',
			script: `${projectDir}/index.js`,
			watch: false,
			env: require( './env' )
		}
	]
};
