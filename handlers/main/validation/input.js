/**
 * @brief	Base Input Class
 */
class Input
{
	constructor( event )
	{
		this.event				= event;
		this.validationHandler	= event.validationHandler;

		this.model				= {};
		this.isInputValid		= null;
	}

	/**
	 * @brief	Checks if the input is valid
	 *
	 * @details	Will check the input parameters only once no matter how many times it is called
	 *
	 * @return	Boolean
	 */
	isValid()
	{
		if ( this.isInputValid === null )
		{
			this.isInputValid	= this._validate();
		}

		return this.isInputValid;
	}

	/**
	 * @brief	Returns the EventRequest
	 *
	 * @returns	Number
	 */
	getEvent()
	{
		return this.event;
	}

	/**
	 * @brief	Gets a given key if the input is valid and the key exists
	 *
	 * @param	key String
	 *
	 * @return	mixed
	 */
	get( key )
	{
		if ( ! this.isValid() || this.model[key] == null )
			throw new Error( 'Invalid input provided.' );

		return this.model[key];
	}

	/**
	 * @brief	Validates the input
	 *
	 * @private
	 *
	 * @return	Boolean
	 */
	_validate()
	{
		return false;
	}
}

module.exports	= Input;