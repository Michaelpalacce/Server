'use strict';

import axios	from 'axios';

/**
 * @brief	ApiCommunicator used to make request to the API of the ServerEmulator
 */
class ApiCommunicator
{
	/**
	 * @details	The APP_ADDRESS is very important for the CORS headers, so this must be set correctly or it will fail
	 */
	constructor()
	{
	}

	/**
	 * @brief	Checks if there is a token in the localStorage
	 *
	 * @return	{Boolean}
	 */
	hasCredentials()
	{
		return !! localStorage.loggedIn;
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
		const response	= await axios.post( `/api/login`, { username, password }, { withCredentials: true } ).catch( ( error ) => {
			return error;
		});

		if ( response.message )
			throw response;

		localStorage.loggedIn	= response.status === 200;
		localStorage.name		= username;

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
			'/api/logout',
			{},
			{ withCredentials: true }
		).catch(() => {});

		localStorage.removeItem( 'loggedIn' );
		localStorage.removeItem( 'route' );
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
			this._formatUrlWithQueryParams( '/api/browse', { directory, token } ),
			{ withCredentials: true }
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
			this._formatUrlWithQueryParams( '/api/browse/file/getFileData', { file } ),
			{ withCredentials: true }
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
		const url	= `/api/browse/${item.isFolder ? 'folder' : 'file'}`

		const response	= await axios.delete(
			this._formatUrlWithQueryParams( url, { item: item.encodedURI } ),
			{ withCredentials: true }
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
			`/api/browse/${item.isFolder ? 'folder' : 'file'}/rename`,
			{ oldPath: item.encodedURI, newPath },
			{ withCredentials: true }
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
			`/api/browse/${item.isFolder ? 'folder' : 'file'}/copy`,
			{ oldPath: item.encodedURI, newPath },
			{ withCredentials: true }
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
			`/api/browse/${item.isFolder ? 'folder' : 'file'}/cut`,
			{ oldPath: item.encodedURI, newPath },
			{ withCredentials: true }
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
			'/api/browse/folder',
			{ directory },
			{ withCredentials: true }
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
			'/api/users',
			{ withCredentials: true }
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
			'/api/browse/user/route',
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		localStorage.route	= response.data.route;

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
			`/api/users/${username}/data`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes the given user
	 *
	 * @param	{String} username
	 *
	 * @return	{Promise<Object>}
	 */
	async deleteUser( username )
	{
		const response	= await axios.delete(
			`/api/users/${username}/delete`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes the current user
	 *
	 * @return	{Promise<Object>}
	 */
	async deleteCurrentUser()
	{
		const response	= await axios.delete(
			`/api/user`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes the current user
	 *
	 * @param	{String} password
	 *
	 * @return	{Promise<Object>}
	 */
	async changeCurrentUserPassword( password )
	{
		const response	= await axios.put(
			`/api/user/password`,
			{ password },
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Creates a new user with the given username and password
	 *
	 * @param	{String} username
	 * @param	{String} password
	 *
	 * @return	{Promise<Object>}
	 */
	async createUser( username, password )
	{
		const response	= await axios.post(
			`/api/users/create`,
			{ username, password },
			{ withCredentials: true }
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
			`/api/users/${oldUser.username}/update`,
			{ oldUser, newUser },
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Gets all the roles and their permissions
	 *
	 * @return	{Promise<Object>}
	 */
	async getRoles()
	{
		const response	= await axios.get(
			`/api/users/roles`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Creates a new role
	 *
	 * @param	{String} name
	 * @param	{Array} permissions
	 *
	 * @return	{Promise<Object>}
	 */
	async addRole( name, permissions )
	{
		const response	= await axios.post(
			`/api/users/role`, { role: { name, permissions } },
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Creates a new role
	 *
	 * @param	{String} name
	 * @param	{Array} permissions
	 *
	 * @return	{Promise<Object>}
	 */
	async updateRole( name, permissions )
	{
		const response	= await axios.put(
			`/api/users/role/${name}`, { permissions },
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes a role
	 *
	 * @param	{String} name
	 *
	 * @return	{Promise<Object>}
	 */
	async deleteRole( name )
	{
		const response	= await axios.delete(
			`/api/users/role/${name}`, {},
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Gets all the dashboard information for the user
	 *
	 * @returns	{Promise<Object>}
	 */
	async getDashboard()
	{
		const response	= await axios.get(
			`/api/dashboard`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Adds a new favorite browse item to the dashboard
	 *
	 * @param	{Object} item
	 *
	 * @return	{Promise<Object>}
	 */
	async addFavoriteBrowseItem( item )
	{
		const response	= await axios.post(
			`/api/browse/file/favorite`,
			{ item },
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
	}

	/**
	 * @brief	Deletes a favorite browse item from the dashboard
	 *
	 * @param	{String} id
	 *
	 * @return	{Promise<Object>}
	 */
	async deleteFavoriteBrowseItem( id )
	{
		const response	= await axios.delete(
			`/api/browse/file/favorite/${id}`,
			{ withCredentials: true }
		).catch( ( error ) => {
			return error.response;
		});

		return response.data;
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
