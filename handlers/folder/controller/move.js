'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const Model			= require( '../model/move' );

const app			= Server();

app.post( '/folder/copy', Model.copy );
app.post( '/folder/cut', Model.cut );
app.post( '/folder/rename', Model.rename );
