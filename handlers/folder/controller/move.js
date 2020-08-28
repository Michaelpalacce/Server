'use strict';

// Dependencies
const app					= require( 'event_request' )();
const Model					= require( '../model/move' );

const fileMoveValidation	= {
	body	: {
		newPath: 'filled||string',
		oldPath: 'filled||string'
	}
};

app.post( '/folder/copy', app.er_validation.validate( fileMoveValidation ), Model.copy );
app.post( '/folder/cut', app.er_validation.validate( fileMoveValidation ), Model.cut );
app.post( '/folder/rename', app.er_validation.validate( fileMoveValidation ), Model.rename );
