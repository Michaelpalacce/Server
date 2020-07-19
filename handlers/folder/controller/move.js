'use strict';

// Dependencies
const app	= require( 'event_request' )();
const Model	= require( '../model/move' );

const fileMoveValidation	= {
	body	: {
		newPath: 'filled||string',
		oldPath: 'filled||string'
	}
};

app.post( /\/folder\/(?:copy|cut|rename)/, app.er_validation.validate( fileMoveValidation ), ( event )=>{
	console.log( 'HEY' );
	event.next();
});

app.post( '/folder/copy', Model.copy );
app.post( '/folder/cut', Model.cut );
app.post( '/folder/rename', Model.rename );
