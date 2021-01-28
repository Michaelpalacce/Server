'use strict';

const path			= require( 'path' );
const fs			= require( 'fs' );
const os			= require( 'os' );

const projectDir				= path.join( __dirname, '..' );
const OS_TEMP_PATH				= os.tmpdir();
const ENV_SEPARATOR				= '=';
const ENV_FILE_NAME				= '.server-emulator-env';
const ENV_FILE_LOCATION_FILE	= path.join( projectDir, '.env-location' );

/**
 * @brief	Gets the location for the env file
 *
 * @return	String
 */
const getEnvFileLocation	= () => {
	if ( ! fs.existsSync( ENV_FILE_LOCATION_FILE ) )
	{
		fs.writeFileSync( ENV_FILE_LOCATION_FILE, path.join( OS_TEMP_PATH, ENV_FILE_NAME ) );
	}

	return fs.readFileSync( ENV_FILE_LOCATION_FILE, { encoding: 'utf8', flag: 'r' } );
}

/**
 * @brief	Holds the locations of different files
 *
 * @var		Object
 */
const locator		= {
	projectDir,
	indexFile		: path.join( projectDir, 'index.js' ),
	envFile			: getEnvFileLocation(),
	envTemplateFile	: path.join( projectDir, '.env.template' ),
	lockFile		: path.join( projectDir, 'pid.lock' ),
	setNewEnv		: ( location ) => {
		if ( fs.existsSync( location ) )
		{
			const newPath	= path.resolve( location, ENV_FILE_NAME );
			locator.envFile	= newPath;
			fs.writeFileSync( ENV_FILE_LOCATION_FILE, newPath );
			return true;
		}

		return false;
	}
};

/**
 * @brief	Holds helper methods when working with the env file
 *
 * @var		Object
 */
const environment	= {
	/**
	 * @brief	Gets all the environment variables
	 *
	 * @return	Object
	 */
	getEnvVariables : () => {
		const lines		= fs.readFileSync( locator.envFile, 'utf-8' ).split( /\r?\n/ );
		const variables	= {};

		for ( const line of lines )
		{
			const parts	= line.split( ENV_SEPARATOR );
			const key	= parts.shift();

			if ( key === '' )
				continue;

			variables[key]	= parts.join( ENV_SEPARATOR ).replace( '\r', '' ).replace( '\n', '' );
		}

		return variables;
	},

	/**
	 * @brief	Sets a new env variable
	 *
	 * @param	{String} key
	 * @param	{String} value
	 * @param	{Function} doneCallback
	 *
	 * @return	void
	 */
	setNewEnvVariable: ( key, value, doneCallback ) => {
		const variables		= environment.getEnvVariables();
		variables[key]		= value;

		const writeStream	= fs.createWriteStream( locator.envFile, { flags: 'w' } );

		console.log( variables );

		for ( const key in variables )
			writeStream.write( `${key}=${variables[key]}${os.EOL}` );

		writeStream.end( doneCallback );
	},

	/**
	 * @brief	Resets the env file to the defaults
	 *
	 * @return	void
	 */
	resetEnvFile: () => {
		fs.copyFileSync( locator.envTemplateFile, locator.envFile );
	},

	/**
	 * @return	Boolean
	 */
	existsEnvFile: () => {
		return fs.existsSync( locator.envFile );
	}
};

/**
 * @brief	Holds helper methods when working with the PID ( lock file )
 *
 * @var		Object
 */
const pid			= {
	/**
	 * @return	Boolean
	 */
	exists	: () => {
		return fs.existsSync( locator.lockFile );
	},

	/**
	 * @brief	Returns the PID
	 *
	 * @return	Number
	 */
	get		: () => {
		return parseInt( fs.readFileSync( locator.lockFile ).toString() );
	},

	/**
	 * @brief	Deletes the pid ( file )
	 *
	 * @return	void
	 */
	delete	: () => {
		if ( fs.existsSync( locator.lockFile ) )
			fs.unlinkSync( locator.lockFile );
	}
};

module.exports	= { locator, environment, pid };
