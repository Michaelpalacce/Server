'use strict';

//Dependencies
const BaseErrorHandler	= require( 'event_request/server/components/error/error_handler' );

/**
 * @brief	Error Handler used to display a stylized error page
 */
class ErrorHandler extends BaseErrorHandler
{
	/**
	 * @brief	Formats the error in a presentable format
	 *
	 * @param	error Error
	 *
	 * @return	Object
	 */
	_formatError( error )
	{
		if ( error instanceof Error )
		{
			error	= error.message;
		}

		return error;
	}

	/**
	 * @copydoc	BaseErrorHandler::_sendError()
	 */
	_sendError( event, error, code )
	{
		if ( ! event.isFinished() )
		{
			error	= error.split( '\\\\' ).join( '\\' );

			if ( event.getHeader( 'x-requested-with' ) === 'XMLHttpRequest' || event.getHeader( 'accepts' ) === 'application/json' )
			{
				event.send( error, code );
			}
			else
			{
				event.render( 'error', { error, code } );
			}
		}
	}
}

module.exports	= ErrorHandler;
