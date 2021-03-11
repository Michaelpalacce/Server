'use strict';

// Checks if there is an environment variable APP_PORT set otherwise attach to 80
module.exports	= process.env.API_PORT || 8888;