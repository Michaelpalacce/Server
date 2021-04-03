'use strict';

import { API_PORT, API_ADDRESS, SSL_KEY_PATH, SSL_CERT_PATH }	from '../../../../env';
import axios													from 'axios';

/**
 * @brief	ApiCommunicator used to make request to the API of the ServerEmulator
 */
class ApiCommunicator
{
	/**
	 * @details	The API_ADDRESS is very important for the CORS headers, so this must be set correctly or it will fail
	 */
	constructor()
	{
		this.port		= API_PORT;
		this.address	= API_ADDRESS;
		this.protocol	= SSL_KEY_PATH && SSL_CERT_PATH ? 'https' : 'http';
		this.url		= `${this.protocol}://${this.address}:${this.port}`;
	}

	/**
	 * @brief	Returns the API url
	 *
	 * @return	{String}
	 */
	getApiUrl()
	{
		return this.url;
	}

	/**
	 * @brief	Checks if there is a token in the localStorage
	 *
	 * @return	{Boolean}
	 */
	hasCredentials()
	{
		return !! localStorage.token;
	}

	/**
	 * @brief	Attempts a login, given the user credentials
	 *
	 * @param	{String} username
	 * @param	{String} password
	 *
	 * @return	{Promise<AxiosResponse<any>>}
	 */
	async login( username, password )
	{
		const response	= await axios.post( `${this.url}/login`, { username, password } ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		localStorage.token	= response.headers.token;

		return response;
	}

	/**
	 * @brief	Logs the user out and removes the token from the localStorage
	 *
	 * @return	{Promise}
	 */
	async logout()
	{
		const response	= await axios.post(
			`${this.url}/logout`,
			{},
			{ headers: this.getAuthHeaders() }
		).catch(() => {});

		localStorage.removeItem( 'token' );

		return response;
	}

	/**
	 * @brief	Returns the items given a directory
	 *
	 * @details	Supports pagination by passing the token returned by the previous browse
	 *
	 * @param	{String} directory
	 * @param	{String} token
	 *
	 * @return	{Promise}
	 */
	async browse( directory = '', token = '' )
	{
		const browseResult	= await axios.get(
			this._formatUrlWithQueryParams( `${this.url}/browse`, { directory, token } ),
			{},
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error;
		});

		const data		= browseResult.data;
		const status	= browseResult.status;

		if ( status !== 200 )
			throw new Error( data );

		return data;
	}

	/**
	 * @brief	Gets a single item file data
	 *
	 * @return	{Promise<Object>}
	 */
	async getFileData( file )
	{
		const browseResult	= await axios.get(
			this._formatUrlWithQueryParams( `${this.url}/file/getFileData`, { file } ),
			{},
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error;
		});

		const data		= browseResult.data;
		const status	= browseResult.status;

		if ( status !== 200 )
			throw new Error( data );

		return data;
	}

	/**
	 * @brief	Gets the authentication headers
	 *
	 * @return	Object
	 */
	getAuthHeaders()
	{
		return { token: localStorage.token };
	}

	/**
	 * @brief	Accepts a url and an Object of query parameters. Formats and returns the new url
	 *
	 * @param	{String} url
	 * @param	{Object} queryParams
	 *
	 * @return	{String}
	 */
	_formatUrlWithQueryParams( url, queryParams )
	{
		let params	= new URLSearchParams();

		for ( const [key, value] of Object.entries( queryParams ) )
		{
			if ( value )
				params.append( key, value );
		}

		params	= params.toString();

		if ( params )
			url += `?${params}`;

		return url;
	}
}

export default new ApiCommunicator();