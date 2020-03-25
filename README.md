###A simple storage app that emulates the file system

#Install Linux
- Make sure you are sudo
~~~
// With NodeJs Installation
yum install -y gcc-c++ make && curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash - && yum install -y nodejs && mkdir server-emulator && cd server-emulator && sudo npm i server-emulator

// With Already Existing NodeJs Installation
mkdir server-emulator && cd server-emulator && sudo npm i server-emulator
~~~

#Install Windows
~~~
# Install NodeJS: https://nodejs.org/en/download/
# Make a new folder and open cmd
# Type:
npm i server-emulator
~~~

#To start
~~~
npm start
~~~

#To compile in windows:
~~~shell script
npm i -g nexe

nexe --no-bundle
~~~

#Github
https://github.com/Michaelpalacce/Server/releases

#Supported NodeJS
- \>= 12.x 

#Supported Systems:
- Windows
- Linux

#Port Forwarding
- You can enable port forwarding on your router to point to the local machine running the server emulator on a given port
- This way you can access the server using your public IP
- Search "Router Port Forwarding" for more information

#Modifications
- You can modify the .env file to your needs.
- APP_PORT will be which port the app is attached to
- SECURITY_ENABLED - whether to secure the app 1 or 0
- ADMIN_USERNAME and ADMIN_PASSWORD - in case of enabled security what are the password and the username
- REQUEST_TIMEOUT - How much to keep requests active for in milliseconds
- UPLOADS_DIR - where to put the temporary upload files 
- ENABLE_TERMINAL - 1 or 0 whether the terminal should be enabled 
- DEBUG - Whether to write logs on a debug level 1 or 0
- TERMINAL_TO_SPAWN - the name of the terminal process to spawn ( for example: In windows if you have git bash you can spawn bash.exe )
- Others should probably not be touched

#Adding users
- If you want to add users go to the users page from the sidebar and click on the Add Users button
- You will be asked to fill in the new user's data
- Permissions currently do not work
- Route will be the path from which the user can access the FS
- When adding a user the user will persist after 5 seconds so don't stop the server
- Only superusers can use the terminal, add/ view/ modify other users ( and self ) 

#Notes
- You may need to delete the cache file if you do changes to the environment ( like enabling security )
- Deleting the cache file will delete all the current users
- If a state arises where there is no root user, one will be created automatically ( with the username and password in the .env file )
- It is a good idea to change the password ( via the gui ) after you've started the server

#Dependencies
- For linux python and make may be required ( for node-pty )
- For Windows you may need to have an installed Windows SDK ( https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/ ).
You may also need the windows-build-tools. You can install them by running a cmd as an administrator and typing:
~~~ bash
npm install --global --production windows-build-tools
~~~
- Install these dependencies only if there is an error while doing npm i server-emulator
- Look for more information here: https://www.npmjs.com/package/node-pty?activeTab=readme

#Known Bugs:
- When doing file operations before the folder has been loaded may result into some files not being loaded
- Cannot detect if you are moving a folder inside itself, so you cant do this: 

        /
            /folder
            /folder2
            
    - copy /folder into folder2 since cannot distinguish whether you are trying to copy a folder into itself

#Future Improvements:
- Ability to tunnel through a different server
