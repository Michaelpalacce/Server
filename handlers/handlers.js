'use strict';

// Dependencies
const { Router }		= require( 'event_request' );

const browseHandler		= require( './browse/controller' );
const downloadHandler	= require( './download/controller' );
const uploadHandler		= require( './upload/controller' );
const deleteHandler		= require( './delete/controller' );
const previewHandler	= require( './preview/controller' );

let router				= new Router();

router.add( browseHandler );
router.add( downloadHandler );
router.add( uploadHandler );
router.add( deleteHandler );
router.add( previewHandler );

module.exports	= router;
