'use strict';

// Checks if there is a PORT assigned ( for heroku deployment ), after which checks if the .env.js file has a value for APP_PORT, otherwise attach to 80
module.exports	= process.env.PORT || process.env.APP_PORT || 80;