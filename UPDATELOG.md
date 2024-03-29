23.1.2
* Fix

23.1.1
* Fix for pm2

23.1.0
* Small fixes
* Fixed the way the env file is created...

23.0.0
* Moved to github actions

22.4.1
- Fixed logout

22.4.0
- Fixed the style for the paste button
- Added a version checker

22.3.0
- Newest version of event_request

22.2.0
- Newest version of event_request allowing me to remove static middleware!
- Removed unnecessary static middleware

22.1.0
- Reduced Dockerfile size
- Improved the user section on mobile

22.0.4
- Reenabled the browsing protection
- Fix to dockerfile to speed up

22.0.3
- jenkinsfile added docker build

22.0.2
- forbidden dirs fix
- Jenkinsfile fix email

22.0.1
- Jenkinsfile

22.0.0
- Small redesign of the menu bars to use icons instead of text, now those icons will be hidden when disabled instead of just changing opacity and disabling them

21.0.1
- Fix for icons

21.0.0
- Added a PWA

20.0.0
- Changed the way data is persisted
- Made a docker image and published it to dockerhub
- Now the default route of the user is cached in localStorage

19.1.0
- Added control and shift clicking

19.0.0
- Creating folders now will navigate you inside the folder
- Added styling for texts thanks to highlight.js
- Moved the current directory in the Back Button section
- Compacted User design and Profile design
- Selecting multiple items now highlights them better
- The Browse menu is now seperated a bit to better reflect different actions
- The Browse Items now will show -- for folder size and will show the time modified

18.1.0
- Login position adjustment

18.0.1
- Fixed a bug with downloading

18.0.0
- Reworked how the menus are displayed
- Dashboard browse favorites are fully functional now
- Fixed metadata being deleted cause of incorrect user handling
- Users are saved more often and with bigger precision
- Components are now fetched async on startup correctly

17.6.0
- Fixed a bug when changing a user's username

17.5.0
- Fixed a lot of permissions and role based bugs, all should work smoothly now.
- Added adding new roles
- Added deletion of roles not in use ( besides root )
- Added role changing ( besides root )
- Newest event_request update
- Improved the initial bootstrap process.
- Added a Refresh button on the Users page for users and roles

17.3.0
- Added visualization for roles

17.3.0
- Added some fixes for permissions, where method was verified last and it should be done first
- Added some fixes in the user permissions to set a default example how permissions should look like
- Started working on Roles and adding roles ( currently only listing is completed and adding is WIP )
- Small changes ( added some animations )

17.2.0
- Some frontend fixes, auth fixes and acl fixes

17.1.5
- Fix to deployment

17.1.4
- Small bugfix

17.1.3
- Dependency moved to newer version
- Fix a small bug with clicking too fast through browse

17.1.2
- Fixed some issues
- Improvements to the browse section, now on-click is handled better
- Added instructions for Development

17.1.1
- Small fix

17.1.0
- Polished update strategy,
- Added new commands to backup user data on update
- Fixed so password is hashed from now on
- Fixed some bugs with permissions

17.0.0
- Major refactoring done, a lot of functionality has been refactored and reworked
- Moved a lot of files around
- Moved towards using pm2 to manage the process instead of own logic
- Removed a lot of commands that were not necessary and a lot of variables
- Terminal removed

16.3.2
- Style changes

16.3.1
- Fixed a big bug with route permissions

16.3.0
- Added a start command
- ER version bump

16.2.3
- Small fix

16.2.2
- Documentation improvements
- Changed the flush for the users ( every 2000ms instead of 2500ms )
- Updated ER to v29.5.3

16.2.1
- Updated ER to v29.5.2 due to set-cookie bug

16.2.0
- Added a way to change the location of the env file
- Documentation improvements
- Added a way to get the project dir

16.1.0
- Works with the latest ER
- Added Badges and a lot of code improvements
- Now non super users no longer have access to the OS tmp dir

16.0.0
- Code improvements according to Codacy
- Code optimization
- Terminal is now bigger

15.0.3
- Terminals are now killed on socket disconnect

15.0.2
- .env is now in os.temp
- Login rate limiting is super strict now

15.0.1
- Fix

15.0.0
- Added SSL Support
- .env file is now unique. It will be created for you if needed.

14.0.7
- Code Cleanup
- Added server as an alias to server-emulator

14.0.6
- Fixed moving

14.0.1-5
- A few test versions

14.0.0
- Made the project act as a CLI

13.0.2
- Works with the latest ER

13.0.1
- Works with the latest ER

13.0.0
- Updated to work with the latest event_request package
- Documentation improvements
- Implemented new event request features

12.5.3
- Updated to work with the latest event_request package

12.5.2
- Updated to work with the latest event_request package

12.5.1
- Fixed the way the caching plugin is set

12.5.0
- Small fix to the front end browsing
- Removed the file-system file and replaced it with the fs-browser module

12.2.4
- Synced with latest EventRequest changes

12.2.3
- WORKING
- Install fix

12.2.2
- BROKEN
- Install fix

12.2.1
- BROKEN
- Install fix

12.2.0
- BROKEN
- Removed NCP as dependency, created own method for copying folders recursively
- Changed the install to use this new script

12.1.0
- The whole directory will no longer be read when browsing.
- Changed the way the file system file gets the data, will create a separate project for it soon
- Changed the line endings of all the files
- Moved the caching server plugin in the kernel

12.0.3
- Users are now saved to the os TMP directory
- Added new USERS_DIR variable

12.0.2
- Disabled security headers

12.0.1
- Implemented bugfix version of event_request
- Updated the readme a bit

12.0.0
- Terminal separated from the project
- Implemented newest event_request version
- Added Security Headers
- Renamed SECURITY_ENABLED to ENABLE_SECURITY
- Added new ENABLE_SECURITY_HEADERS env variable
- Added new APP_ADDRESS env variable

11.3.5
- Updated README a bit

11.3.4
- Added gitignore for the users file
- Updated the install instructions

11.3.2
- Fix

11.3.1
- Small fix

11.3.0
- No styles are done inline
- No scripts are done inline
- Removed the Js libs that are repeated in the login
- Render now sets content-type header
- Fixed the NCP command...

11.2.1
- Readme updated a bit

11.2.0
- Dropzone text is now unselectable
- Added Permissions
- Now pressing escape when the modal is up will return false or empty depending

11.1.1
- Newest EventRequest version
- Updated readme a bit
- Updated the rate limits
- Users will NOT expire anymore
- Users are now stored separately

11.1.0
- Improved loading to have directories loaded first and then files
- Updated readme

11.0.0
- Added error handling for delete as well
- Added user input
- Added an error page
- Improved loading ( now is done on scroll )

10.0.1
- README changes

10.0.0
- Only SU can now access the Project Root
- Most pages are now cached
- Added A LOT of security regarding what you can do with the permissions you have
- Project Root can not be changed now, no matter what you do
- Added a lot of error handling
- Upload failed now will show an error
- Fixed a reload bug if accessing unauthorized pages
- Small design overhaul

9.1.2
- Can now use the terminal and add users even if the security is disabled

9.1.1
- Implemented new EventRequest version with the improved Data Server

9.1.0
- Implemented new EventRequest version to fix some issues with the data server
- Refactored the code to make it more readable and separated the logic where needed
- Added more user validation
- Users are now flushed more often
- Added TERMINAL_TO_SPAWN option
- The Server on error is now handled gracefully
- Fixed uploading of duplicates

9.0.1
- Font size is smaller

9.0.0
- Added a terminal
- Refactored the structure of the project entirely to be more separated
- Added new env variable
- Added more details to the readme
- All SU users will have route === /

8.11.2
- Updated the README
- Moved some controllers around

8.11.1
- Changed some text

8.11.0
- Added ability to update the users

8.10.0
- Added ability ot add and delete users
- Updating users is not possible yet
- Users will have different route permissions

8.9.1
- Forgot to update event_request

8.9.0
- Implemented the newest version of event_request to add audio streams

8.8.1
- Implemented the newest version of event_request to add more stream types

8.8.0
- Added a logout functionality
- Implemented the newest version of event_request to fix the session ttl and the set cookie in general
- Added a User section that for now only lists the users
- You can now see the IP section from anywhere and use it from anywhere
- The login page is now also black
- Updated README
- Started working on the users functionality and added a UserManager in the backend

8.7.1
- Updated README

8.7.0
- Fixed Recursion bug when copying/pasting
- Moved IPs to the sidebar
- Removed Home link

8.6.1
- Fixed Preview of text

8.6.0
- Added folder downloading

8.5.1
- Updated the future improvements section

8.5.0
- Added Folder renaming
- Added Folder Cutting
- Added Folder Copying
- Added Add Folder In the context Menu

8.4.1
- Small Quality of life changes
- Moved the back button

8.4.0
- Removed the preview page and moved it to the modal
- Increased loading time
- Fixed delete snapping to top bug
- Preview of files is now shown correctly
- Removed the unused logo
- Moved the add folder button to the side
- Modal elements will now focus when displayed
- Improved design and removed unused styles

8.3.0
- Added Modal logic
- Added modals instead of prompts and alerts
- Moved the Upload Folder button to the sidebar
- The mobile design now works correctly
- Updated the design a bit

8.2.5
- Small design fix

8.2.4
- Small fix

8.2.3
- Improved icons for the Back and Add folder buttons
- Updated the style

8.2.2
- Added Error Handling to the contextMenu
- No longer relying on CDNs
- Fixed IP route
- Separated css files and separated EJS files
- There is no longer an error when canceling creation of a file

8.2.1
- Reworked the routes

8.2.0
- Updates to the front end JS to be in classes and better structured

8.1.1
- Download for files containing a comma fix

8.1.0
- Added a nav bar
- Some improvements to the backend
- Moved out of the templating engine plugin cause of the way ejs works

8.0.5
- Added start instructions

8.0.4
- Fixed the installation

8.0.1
- Added Linux Installation instructions
- Added Windows Installation instructions
- The project will now copy and install in the current directory

8.0.0
- Now works with a different ENV_VARIABLE for port ( APP_PORT )
- Changed the name of the project to server-emulator
- Fixed the ip's not showing the port
- Added ability to disable the security
-

7.2.0
- Works with the newest version of the EventRequest
- Major Stability improvements
- Now works On Linux
- Works On Virtual Machines too

7.1.0
- Works with the newest version of the EventRequest

7.0.3
- Works with latest event_request version

7.0.2
- Added a lot of bugfixes and added renaming of files

7.0.1
- Fixed Context menu elements redirecting

7.0.0
- Added UPDATELOG.md
- Added copy and cut functionality.
- Small improvements to the stability and the overall code
- Implemented the newest event_request version
- Moved common data to functions
