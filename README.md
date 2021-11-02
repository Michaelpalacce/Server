### A simple storage app that emulates the file system with Users 

#### More features and modules will be added overtime.

# Supported NodeJS
- \>= 12.x 

# Supported Systems:
- Windows
- Linux

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0b4f4870655d46e59396a530b651d5b9)](https://app.codacy.com/manual/Michaelpalacce/Server?utm_source=github.com&utm_medium=referral&utm_content=Michaelpalacce/Server&utm_campaign=Badge_Grade_Dashboard)

# Docker:
Images are available for amd64 and arm64 architectures. [Docker Hub](https://hub.docker.com/repository/docker/stefangenov/server)

### Running:
~~~bash
docker run  -p 8080:80 -d stefangenov/server 
~~~
Access your app on http://localhost:8080

### Setting it up on K8s:
[Example K8S Setup](https://github.com/Michaelpalacce/HomeLab/tree/master/Helm/apps/storage)

# Installation:
~~~bash
npm i -g server-emulator
~~~

# Use:
- You can use either `serve` or `server-emulator`
~~~
serve # starts the server
serve start # also starts the server
~~~

- List of commands:
~~~
Commands:
serve ---> starts the server
serve start ---> starts the server
serve start --standalone[-s] ---> starts the server without the pm2 daemon ( useful for testing errors )
serve status ---> gets the status of the server
serve edit---> edit environment variables 
serve stop ---> stop the server
~~~
- Additionally, this module uses pm2 to handle the daemonizing of the process you can check out: https://www.npmjs.com/package/pm2 for more info

# Installing and configuring persistence. Setting SERVER_CONFIG_PATH env variable
- All the data of the server is stored in 3 files:
1. env.js -> stores environment data ( BESIDES SERVER_CONFIG_PATH )
2. cache -> stores user sessions
3. se_users.json -> stores user data
- All of these files will be created in the SERVER_CONFIG_PATH environment variable. Note: If this is not set then all of them
will be created in the os.tmpdir(). This env variable will not be in the env.js file and will be used to create an initial env.js at the given location.

# API Environment variables ( editable via serve edit )
- APP_PORT - Which port the server will be running on
- APP_ADDRESS - Which IP address to bind to
- ADMIN_USERNAME and ADMIN_PASSWORD - The root username and password 
- SUDO - If you want the root user to have access to /. Note: you can always make an admin that has access to it, since you can change other users but not the root one. 
Keep this to "0" if you worry about security. Defalts to "0"
- USER_DATA_PATH - The default location that new users's data will be placed on the filesystem. Defaults to /data 
- SSL_KEY_PATH - The ABSOLUTE path to the SSL key
- SSL_CERT_PATH - The ABSOLUTE path to the SSL certificate
- DEBUG - Whether to display console logs or not ( for Dev )
- NODE_ENV - Keep it to production. If you are working on the plugin, change to development

# Enabling SSL
- Generate a certificate and point the SSL_KEY_PATH and SSL_CERT_PATH to their locations

# Adding users
- If you want to add users go to the users page from the navbar and click on the Add New Users button
- You will be asked to fill in the new user's data
- After which feel free to click on the newly created user and edit it's data
- Browse Module Route is the route under which the user will be able to access the FS and edit delete,download,copy, etc.
This will be: `process.envUSER_DATA_PATH/{{ USERNAME }}`
- The user can have user permissions set which have priority over role permissions

# Roles
- Roles order matters as the first rule to be matched will be the one that will be used
- You can add your own roles with permissions

# Permissions:
- Only root and admin users can add/ view/ modify other users ( and self ). 
- Nobody can access the project folder.
- Nobody can access the config Folder.
- Nobody can do any operations on the PROJECT_ROOT as well as many operations including the folder structure where the project is
- Nobody can do any operations on the config Folder

# User Permissions

### Route
- The first rule that matches the route will be used. If ALLOW is set, then the user is allowed through and no more rules are parsed.
  If DENY is set, then an Error is thrown
- Examples Permissions that deny access to any route starting with /users with any method and allowing everything else:
~~~json
{
	"route": [
		{
			"type": "ALLOW",
			"route": {
          "regexp": {
              "source": "^\/api\/browse?(.+)",
              "flags": ""
          }
      },
			"method": ""
		},
		{
			"type": "ALLOW",
			"route": "/api/user",
			"method": "DELETE"
		},
		{
			"type": "ALLOW",
			"route": "/api/user/password",
			"method": "PUT"
		},
		{
			"type": "DENY",
			"route": "",
			"method": ""
		}
	]
}
~~~
- When editing the permissions and you want to set a regexp as a route follow the structure given below. It is important
  to escape any characters that would normally be escaped in JSON ( in this case a backward slash ) since this structure will be 
  JSON stringified and sent to the API.
~~~json
{
  "route": [
    {
      "type": "DENY",
      "route": {
        "regexp": {
          "source": "^\\/users?(.+)",
          "flags": ""
        }
      },
      "method": ""
    }
  ]
}
~~~


# Notes
- If a state arises where there is no root user, one will be created automatically ( with the username and password in the env.js file )
- No operations can be done on the root user ( root role does not prevent anything )
- It is a good idea to change the root password ( via the env.js )

# Known Bugs:
- Cannot detect if you are moving a folder inside itself, so you can't do this: 
       
        /
            /folder
            /folder2
            
    - copy /folder into /folder2 since I cannot distinguish whether you are trying to copy a folder into itself which will brick your disk if it happens ( or maybe I can but whatever didn't work the one time I tried to solve this )


# Development

To run the project in development, make sure to have an env.js file. The APP_PORT variable must be set to 8888 ( or edit the variable in 
vue.config.js and change it to whatever you like ) and the NODE_ENV must be set to development. After which you can run 

~~~bash
npm run serve-dev
# or
pm2-runtime dev.ecosystem.config.js
~~~


To test in production run: 

~~~bash
npm run build
npm run serve
~~~

You can stop a production app by running 

~~~bash
pm2 stop all
~~~

A sample env.js for development can be:

~~~javascript
const path		= require( 'path' );

module.exports	= {
	APP_PORT: process.env.APP_PORT || "8888",
	APP_ADDRESS: process.env.APP_ADDRESS || "0.0.0.0",
	ADMIN_USERNAME: process.env.ADMIN_USERNAME || "root",
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "toor",
	DEBUG: process.env.DEBUG || "1",
	SSL_KEY_PATH: process.env.SSL_KEY_PATH || "",
	SSL_CERT_PATH: process.env.SSL_CERT_PATH || "",
	NODE_ENV: process.env.NODE_ENV || "development",
	USER_DATA_PATH: process.env.USER_DATA_PATH || "/data",
	SUDO: process.env.SUDO || "1",
	SERVER_CONFIG_PATH: path.resolve( './' )
};
~~~

# Docker Building

~~~bash
./BUILD
~~~
- This will build the image and publish it to docker hub
