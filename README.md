### A simple storage app that emulates the file system with Users 

#### More features and modules will be added overtime.

# Supported NodeJS
- \>= 12.x 

# Supported Systems:
- Windows
- Linux

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0b4f4870655d46e59396a530b651d5b9)](https://app.codacy.com/manual/Michaelpalacce/Server?utm_source=github.com&utm_medium=referral&utm_content=Michaelpalacce/Server&utm_campaign=Badge_Grade_Dashboard)

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
- Additionally this module uses pm2 to handle the daemonizing of the process you can checkout: https://www.npmjs.com/package/pm2 for more info

# API Environment variables
- APP_PORT - Which port the server will be running on
- APP_ADDRESS - Which IP address to bind to
- ADMIN_USERNAME and ADMIN_PASSWORD - The root username and password 
- SSL_KEY_PATH - The ABSOLUTE path to the SSL key
- SSL_CERT_PATH - The ABSOLUTE path to the SSL certificate
- DEBUG - Whether to display console logs or not ( for Dev )
- NODE_ENV - Keep it to production. If you are working on the plugin, change to development

# UPDATING:
- Since npm cleans up the directory on update, you can run the following command: `serve-hooks preinstall`.
This will move your files to os.tmpDir.
- Run: `npm update -g server-emulator`
- Run: `serve-hooks postinstall` and this will move the config files from the os.tmpDir back to the project.

# Enabling SSL
- Generate a certificate and point the SSL_KEY_PATH and SSL_CERT_PATH to their locations

# Adding users
- If you want to add users go to the users page from the navbar and click on the Add New Users button
- You will be asked to fill in the new user's data
- After which feel free to click on the newly created user and edit it's data
- Browse Module Route is the route under which the user will be able to access the FS and edit delete,download,copy, etc
- The user can have user permissions set which have priority over role permissions

# Roles
- WIP 
- Currently ony has root and user
- Roles order matters as the first rule to be matched will be the one that will be used
- WIP You can add your own roles with permissions

# Permissions:
- Only root and admin users can add/ view/ modify other users ( and self ). 
- Nobody can access the project folder .
- Nobody can do any operations on the PROJECT_ROOT as well as many operations including the folder structure where the project is

# User Permissions

### Route
- The first rule that matches the route will be used. If ALLOW is set, then the user is allowed through and no more rules are parsed.
  If DENY is set, then an Error is thrown
- Examples Permissions that deny access to any route starting with /users with any method and allowing everything else:
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
    },
    {
      "type": "ALLOW",
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
- Some functionality is broken on virtual machines...
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