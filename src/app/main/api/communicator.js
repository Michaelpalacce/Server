'use strict';

import { API_PORT, API_ADDRESS, SSL_KEY_PATH, SSL_CERT_PATH }	from '../../../../env';
import axios													from 'axios';
import { encode, decode }										from '@/../api/main/utils/base_64_encoder'

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
			{ headers: { token: localStorage.token } }
		).catch(() => {});

		localStorage.removeItem( 'token' );

		return response;
	}

	async browse( directory = '/', token = '' )
	{
		directory			= encode( directory );

		const browseResult	= await axios.get(
			`${this.url}/browse`,
			{ directory, token },
			{ headers: { token: localStorage.token } }
		).catch( ( error ) => {
			return error;
		});

		const data		= browseResult.data;
		const status	= browseResult.status;

		if ( status !== 200 )
			throw new Error( data );

		return data;
	}
}

export default new ApiCommunicator();