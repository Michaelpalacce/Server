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