'use strict';

// Dependencies
const { Server }		= require( 'event_request' );

const securityHandler	= require( './main/security' );
const browseHandler		= require( './browse/controller' );
const downloadHandler	= require( './download/controller' );
const uploadHandler		= require( './upload/controller' );
const deleteHandler		= require( './delete/controller' );
const previewHandler	= require( './preview/controller' );
// const messagesHandler	= require( './messages/controller' );

let router				= Server().Router();

router.add( securityHandler );
router.add( browseHandler );
router.add( downloadHandler );
router.add( uploadHandler );
router.add( deleteHandler );
router.add( previewHandler );
// router.add( messagesHandler );

module.exports	= router;
