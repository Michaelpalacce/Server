### A simple storage app that emulates the file system

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
serve edit api---> edit environment variables for the API
serve edit app---> edit environment variables for the APP
serve stop ---> stop the server
~~~

# API Environment variables
- API_PORT - Which port the api will be running on
- API_ADDRESS - Which IP address to bind to
- ADMIN_USERNAME and ADMIN_PASSWORD - in case of enabled security what are the password and the username
- SSL_KEY_PATH - The ABSOLUTE path to the SSL key
- SSL_CERT_PATH - The ABSOLUTE path to the SSL certificate
- USER_PERSIST_INTERVAL - How often in milliseconds the users will be persisted to storage, Defaults to 10000
- DEBUG - Whether to display console logs or not

# APP Environment variables
- PORT - which port the front end app should listen on

# Enabling SSL
- Generate a certificate and point the SSL_KEY_PATH and SSL_CERT_PATH to their locations

# Adding users
- If you want to add users go to the users page from the sidebar and click on the Add Users button
- You will be asked to fill in the new user's data
- Route will be the path from which the user can access the FS
- When adding a user the user will persist after 5 seconds so don't stop the server

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
- It is a good idea to change the password ( via the gui and in the env.js ) after you've started the server

# Known Bugs:
- Some functionality is broken on virtual machines...
- Cannot detect if you are moving a folder inside itself, so you can't do this: 
       
        /
            /folder
            /folder2
            
    - copy /folder into /folder2 since I cannot distinguish whether you are trying to copy a folder into itself which will brick your disk if it happens
