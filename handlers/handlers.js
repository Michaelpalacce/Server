'use strict';

// Dependencies
const Router	= require( './../lib/server/router' );
const index		= require( './index/controller' );
const browse	= require( './browse/controller' );
const download	= require( './download/controller' );
const login		= require( './login/controller' );
const upload	= require( './upload/controller' );

let router		= new Router();

router.add( index );
router.add( browse );
router.add( download );
router.add( login );
router.add( upload );

module.exports	= router;
