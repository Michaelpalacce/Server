### A simple storage app that emulates the file system

# Supported NodeJS
- \>= 12.x 

# Supported Systems:
- Windows
- Linux

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0b4f4870655d46e59396a530b651d5b9)](https://app.codacy.com/manual/Michaelpalacce/Server?utm_source=github.com&utm_medium=referral&utm_content=Michaelpalacce/Server&utm_campaign=Badge_Grade_Dashboard)

# Use:
- You can use either `server` or `server-emulator`
~~~
server-emulator daemon # starts a daemon process
server daemon # starts a daemon process

server-emulator kill # kills the daemon process
server kill # kills the daemon process

server-emulator # starts the process without daemonizing 
server-emulator start # starts the process without daemonizing 

server # starts the process without daemonizing 
server start # starts the process without daemonizing 

server-emulator set APP_PORT 8000 # changes the app port
server set APP_PORT 8000 # changes the app port

sever-emulator set ENABLE_SECURITY 1 # enables the user management
sever set ENABLE_SECURITY 1 # enables the user management
~~~

- List of commands:
~~~
Commands:
server-emulator ---> starts the server
server-emulator start ---> starts the server
server-emulator daemon ---> starts the server in a detached deamon mode, returns the PID. If a daemon is running, will output the daemon pid
server-emulator kill  ---> kills the daemon
server-emulator getProjectDir ---> returns the absolute path to the project
server-emulator getEnvPath ---> returns the absolute path to the .env file
server-emulator terminal ---> installs terminal dependencies ( currently not working )
server-emulator set ${ENV_KEY} ${ENV_VALUE} ---> Changes .env file values or adds new ones.
server-emulator get ---> Gets all the .env variables
server-emulator resetEnv ---> Resets the .env file to the defaults.
server-emulator setEnv ---> Sets a new location for the .env file and resets it
server-emulator deletePid ---> Deletes the PID file

~~~

# Enabling the terminal

### Windows
~~~
npm install --global windows-build-tools
server-emulator set ENABLE_TERMINAL 1
server-emulator terminal
~~~

### Linux
~~~
server-emulator set ENABLE_TERMINAL 1
server-emulator terminal
~~~

# Terminal Dependencies
- If you have any issues with the terminal LOOK HERE: https://www.npmjs.com/package/node-pty?activeTab=readme

# Port Forwarding
- You can enable port forwarding on your router to point to the local machine running the server emulator on a given port
- This way you can access the server using your public IP
- Search "Router Port Forwarding" for more information

# Modifications
- You can modify the .env file to your needs.
- APP_PORT will be which port the app is attached to
- ENABLE_SECURITY - whether to secure the app 1 or 0
- ADMIN_USERNAME and ADMIN_PASSWORD - in case of enabled security what are the password and the username
- REQUEST_TIMEOUT - How much to keep requests active for in milliseconds
- UPLOADS_DIR - where to put the temporary upload files 
- ENABLE_TERMINAL - 1 or 0 whether the terminal should be enabled ( CURRENTLY NOT WORKING )
- ENABLE_SECURITY_HEADERS - 1 or 0 whether the security headers should be enabled or not ( hsts, Expect-CT, CSP, Content Type Options )
- DEBUG - Whether to write logs on a debug level 1 or 0
- USERS_DIR - Where the users should be stored. If empty then the os.tmpDir will be used, if === 'LOCAL_DIR' then the project root will be used
- TERMINAL_TO_SPAWN - the name of the terminal process to spawn ( for example: In windows if you have git bash you can spawn bash.exe )
- SSL_KEY_PATH - The ABSOLUTE path to the SSL key
- SSL_CERT_PATH - The ABSOLUTE path to the SSL certificate

# Enabling SSL
- Generate a certificate and point the SSL_KEY_PATH and SSL_CERT_PATH to their locations
- Set the APP_PORT to 443

# Changing env file location
- By default the env file that the server will use will be located in the OS' temp folder.
- If you wish to change it you can do it by: `server-emulator setEnv .` ( this will change it to the current folder)
- This will reset any env variables you may have set before, so back those up
- It is a good idea to put this in the project directory, as this will prevent it from modified by anyone who is not a Super user

# Adding users
- If you want to add users go to the users page from the sidebar and click on the Add Users button
- You will be asked to fill in the new user's data
- Route will be the path from which the user can access the FS
- When adding a user the user will persist after 5 seconds so don't stop the server
- User's data is stored to the OS tmp directory by default and can be changed using the USERS_DIR variable ( either LOCAL_DIR or empty )

# Permissions:
- Only superusers can use the terminal, add/ view/ modify other users ( and self ). Only superusers can access the project folder and the OS tmp directory.
- Nobody can delete or change the permissions of the root user.
- Nobody can do any operations on the PROJECT_ROOT as well as many operations including the folder structure where the project is
- When adding a user a set of permissions will be asked for. Those permissions are forbidding. Whatever you type in there, the users WON'T be able to access.
- You may leave the method empty which will mean ANY method or pass in an Array

# Notes
- You may need to delete the cache file if you do changes to the environment ( like enabling security )
- If a state arises where there is no root user, one will be created automatically ( with the username and password in the .env file )
- It is a good idea to change the password ( via the gui and in the .env ) after you've started the server

# Known Bugs:
- Some functionality is broken on virtual machines...
- Cannot detect if you are moving a folder inside itself, so you can't do this: 
       
        /
            /folder
            /folder2
            
    - copy /folder into /folder2 since I cannot distinguish whether you are trying to copy a folder into itself which will brick your disk if it happens
