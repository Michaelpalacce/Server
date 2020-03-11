'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const Model			= require( '../model/move' );

const app			= Server();

app.post( '/file/copy', Model.copy );
app.post( '/file/cut', Model.cut );
app.post( '/file/rename', Model.rename );
