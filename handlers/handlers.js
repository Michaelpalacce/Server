'use strict';

// Dependencies
const Server			= require( 'event_request' );

const browseHandler		= require( './browse/controller' );
const downloadHandler	= require( './download/controller' );
const loginHandler		= require( './login/controller' );
const uploadHandler		= require( './upload/controller' );
const deleteHandler		= require( './delete/controller' );
const previewHandler	= require( './preview/controller' );

let router				= new Server.Router();

router.add( browseHandler );
router.add( downloadHandler );
router.add( loginHandler );
router.add( uploadHandler );
router.add( deleteHandler );
router.add( previewHandler );

module.exports	= router;
