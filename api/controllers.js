'use strict';

const path		= require( 'path' );
const fs		= require( 'fs' );
const app		= require( 'event_request' )();
const apiRouter	= app.Router();

// Main
apiRouter.add( require( './main/security/security' ) );

// BROWSE MODULE
// Browse user section
apiRouter.add( require( './modules/browse/user/controller/route' ) );


// Browse file section
apiRouter.add( require( './modules/browse/file/controller/move' ) );
apiRouter.add( require( './modules/browse/file/controller/file_data' ) );
apiRouter.add( require( './modules/browse/file/controller/download' ) );
apiRouter.add( require( './modules/browse/file/controller/upload' ) );
apiRouter.add( require( './modules/browse/file/controller/delete' ) );
apiRouter.add( require( './modules/browse/file/controller/preview' ) );
apiRouter.add( require( './modules/browse/file/controller/favorites' ) );


// Browse folder section
apiRouter.add( require( './modules/browse/folder/controller/view' ) );
apiRouter.add( require( './modules/browse/folder/controller/delete' ) );
apiRouter.add( require( './modules/browse/folder/controller/upload' ) );
apiRouter.add( require( './modules/browse/folder/controller/move' ) );

// USERS MODULE

// Users Users CRUD section
apiRouter.add( require( './modules/users/controller/list' ) );
apiRouter.add( require( './modules/users/controller/users' ) );

// Users Users Roles section
apiRouter.add( require( './modules/users/controller/roles' ) );

// USER MODULE

// User User Management section
apiRouter.add( require( './modules/user/controller/user' ) );

// DASHBOARD MODULE

// Dashboard fetch section
apiRouter.add( require( './modules/dashboard/controllers/view' ) );

const PROJECT_ROOT	= path.parse( require.main.filename ).dir;

// Backend
app.add( '/api', apiRouter );
// Serve dist
app.apply( app.er_static, { paths: ['dist'] } );
// Frontend
app.get(( event )=>{
	fs.createReadStream( `${PROJECT_ROOT}/dist/index.html` ).pipe( event.response );
});