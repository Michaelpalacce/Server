'use strict';

// Dependencies
const app			= require( 'event_request' )();
const Model			= require( '../model/move' );

app.post( '/file/copy', Model.copy );
app.post( '/file/cut', Model.cut );
app.post( '/file/rename', Model.rename );
