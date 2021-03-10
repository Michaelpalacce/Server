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

app.post( '/file/copy', app.er_validation.validate( fileMoveValidation ), Model.copy );
app.post( '/file/cut', app.er_validation.validate( fileMoveValidation ), Model.cut );
app.post( '/file/rename', app.er_validation.validate( fileMoveValidation ), Model.rename );
