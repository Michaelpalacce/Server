'use strict';

// Dependencies
const app	= require( 'event_request' )();
const Model	= require( '../model/move' );

app.post( '/folder/copy', Model.copy );
app.post( '/folder/cut', Model.cut );
app.post( '/folder/rename', Model.rename );
