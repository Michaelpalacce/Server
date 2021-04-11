'use strict';

// Main
require( './main/security/security' );

// BROWSE MODULE
// Browse user section
require( './modules/browse/user/controller/route' );

// Browse file section
require( './modules/browse/file/controller/move' );
require( './modules/browse/file/controller/file_data' );
require( './modules/browse/file/controller/download' );
require( './modules/browse/file/controller/upload' );
require( './modules/browse/file/controller/delete' );
require( './modules/browse/file/controller/preview' );

// Browse folder section
require( './modules/browse/folder/controller/view' );
require( './modules/browse/folder/controller/delete' );
require( './modules/browse/folder/controller/upload' );
require( './modules/browse/folder/controller/move' );



// USERS MODULE

// Users Users CRUD section
require( './modules/users/controller/list' );
require( './modules/users/controller/users' );

// Users Users Roles section
require( './modules/users/controller/roles' );



// USER MODULE

// User User Management section
require( './modules/user/controller/user' );