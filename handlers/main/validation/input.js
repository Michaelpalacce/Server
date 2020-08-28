'use strict';

// Dependencies
const ValidationResult	= require( 'event_request/server/components/validation/validation_result' );

/**
 * @brief	Base Input Class
 */
class Input
{
	constructor( event )
	{
		this.event				= event;
		this.validationHandler	= event.validation;

		this.model				= {};
		this.isInputValid		= null;
		this.reason				= [];
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
	 * @brief	Gets the reason for the failure
	 *
	 * @returns	Array
	 */
	getReason()
	{
		return this.reason instanceof ValidationResult ? this.reason.getValidationResult() : this.reason;
	}

	/**
	 * @brief	Gets the reason as a string
	 *
	 * @returns	String
	 */
	getReasonToString()
	{
		return JSON.stringify( this.getReason() );
	}

	/**
	 * @brief	Gets a given key if the input is valid and the key exists
	 *
	 * @param	{String} key
	 *
	 * @return	*
	 */
	get( key )
	{
		if ( ! this.isValid() || this.model[key] == null )
			throw {
				code	: 'app.validation',
				message	: `Invalid input: ${this.getReasonToString()}`,
				status	: 400
			};

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