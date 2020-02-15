'use strict';

// Dependencies
const { Server }	= require( 'event_request' );
const Model			= require( '../model/model' );

const router		= Server().Router();

router.post( '/copy', Model.copy );
router.post( '/cut', Model.cut );

module.exports	= router;
