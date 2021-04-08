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
		localStorage.name	= username;

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
		localStorage.removeItem( 'name' );

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
		return axios.get(
			this._formatUrlWithQueryParams( `${this.url}/browse`, { directory, token } ),
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});
	}

	/**
	 * @brief	Gets a single item file data
	 *
	 * @return	{Promise<Object>}
	 */
	async getFileData( file )
	{
		const response	= await axios.get(
			this._formatUrlWithQueryParams( `${this.url}/file/getFileData`, { file } ),
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes an item
	 *
	 * @details	Works with both folders and files
	 * 			This will return the response and not the response body intentionally
	 *
	 * @param	{Object} item
	 *
	 * @return	{Promise<Object>}
	 */
	async deleteItem( item )
	{
		const url	= `${this.url}/${item.isFolder ? 'folder' : 'file'}`

		const response	= await axios.delete(
			this._formatUrlWithQueryParams( url, { item: item.encodedURI } ),
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response;
	}

	/**
	 * @brief	Renames an item
	 *
	 * @details	Works with both folders and files
	 *
	 * @param	{Object} item
	 * @param	{String} newPath
	 *
	 * @return	{Promise<Object>}
	 */
	async renameItem( item, newPath )
	{
		const response	= await axios.post(
			`${this.url}/${item.isFolder ? 'folder' : 'file'}/rename`,
			{ oldPath: item.encodedURI, newPath },
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Copies an item
	 *
	 * @details	Works with both folders and files
	 *
	 * @param	{Object} item
	 * @param	{String} newPath
	 *
	 * @return	{Promise<Object>}
	 */
	async copyItem( item, newPath )
	{
		const response	= await axios.post(
			`${this.url}/${item.isFolder ? 'folder' : 'file'}/copy`,
			{ oldPath: item.encodedURI, newPath },
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Cuts an item
	 *
	 * @details	Works with both folders and files
	 *
	 * @param	{Object} item
	 * @param	{String} newPath
	 *
	 * @return	{Promise<Object>}
	 */
	async cutItem( item, newPath )
	{
		const response	= await axios.post(
			`${this.url}/${item.isFolder ? 'folder' : 'file'}/cut`,
			{ oldPath: item.encodedURI, newPath },
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Creates a new folder
	 *
	 * @param	{Object} directory
	 *
	 * @return	{Promise<Object>}
	 */
	async createFolder( directory )
	{
		const response	= await axios.post(
			`${this.url}/folder`,
			{ directory },
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Gets all the users and their data
	 *
	 * @return	{Promise<Object>}
	 */
	async getUsers()
	{
		const response	= await axios.get(
			`${this.url}/users`,
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Gets all the users and their data
	 *
	 * @return	{Promise<Object>}
	 */
	async getUserRoute()
	{
		const response	= await axios.get(
			`${this.url}/browse/user/route`,
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Gets all the users and their data
	 *
	 * @param	{String} username
	 *
	 * @return	{Promise<Object>}
	 */
	async getUserData( username )
	{
		const response	= await axios.get(
			`${this.url}/users/${username}`,
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Updates the user, the oldUser must be passed to detect changes in the username
	 *
	 * @details	Expects User.getUserData() as a parameter for both
	 *
	 * @param	{Object} oldUser
	 * @param	{Object} newUser
	 *
	 * @return	{Promise<Object>}
	 */
	async updateUser( oldUser, newUser )
	{
		const response	= await axios.patch(
			`${this.url}/users/${oldUser.username}`,
			{ oldUser, newUser },
			{ headers: this.getAuthHeaders() }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
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
	 * @brief	Returns either an error response or the actual response if it was 2xx
	 *
	 * @param	{Object} response
	 *
	 * @return	{*}
	 */
	_handleResponse( response )
	{
		const status	= response.status;

		if ( status % 200 >= 100 )
			throw response.response.data;

		return response.data;
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