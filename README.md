###A simple storage app that emulates the file system

#Install Linux
- Make sure you are sudo
~~~
// With NodeJs Installation
yum install -y gcc-c++ make && curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash - && yum install -y nodejs && mkdir server-emulator && cd server-emulator && npm i server-emulator

// With Already Existing NodeJs Installation
mkdir server-emulator && cd server-emulator && npm i server-emulator
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

#To compile:
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
- Search "Router Port Forwarding for more information"

#Modifications
- You can modify the .env file to your needs.
- APP_PORT will be which port the app is attached to
- SECURITY_ENABLED - whether to secure the app
- ADMIN_USERNAME and ADMIN_PASSWORD - in case of enabled security what are the password and the username
- REQUEST_TIMEOUT - How much to keep requests active for
- UPLOADS_DIR - where to put the temporary upload files
- DEBUG - Whether to write logs on a debug level
- Others should probably not be touched

#Known Bugs:
- When handling big folders and uploading at the same time, may display some items twice or fail loading

#Future Improvements:
- A terminal emulator
- More folder operations
- Redesign
- Black theme
- User section
- Improved File Streaming Page
- Ability to connect to a different server to serve as a connection between your devices and a private instance of the Server Emulator
