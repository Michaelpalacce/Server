'use strict';

// Dependencies
const Router			= require( './../lib/server/router' );

const browseHandler		= require( './browse/controller' );
const downloadHandler	= require( './download/controller' );
const loginHandler		= require( './login/controller' );
const uploadHandler		= require( './upload/controller' );
const deleteHandler		= require( './delete/controller' );

let router				= new Router();

router.add( browseHandler );
router.add( downloadHandler );
router.add( loginHandler );
router.add( uploadHandler );
router.add( deleteHandler );

module.exports	= router;
