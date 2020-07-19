'use strict';

// Dependencies
const app			= require( 'event_request' )();
const Model			= require( '../model/move' );

const fileMoveValidation	= {
	body	: {
		newPath: 'filled||string',
		oldPath: 'filled||string'
	}
};

app.post( /\/file\/(?:copy|cut|rename)/, app.er_validation.validate( fileMoveValidation ), ( event )=>{
	event.next();
});

app.post( '/file/copy', Model.copy );
app.post( '/file/cut', Model.cut );
app.post( '/file/rename', Model.rename );
