# Server
A simple storage solution app to be run on localhost
The focus of this project is not the client side, but the server side. The goal is to create a server that is easily
able to process different requests.
Includes:
- Body parsers ( body can be processed in the background )
1) Form Body Parser
2) Multipart Body Parser ( works with buffers and saves binary data after processing, time to process 1.4GB file: 4.5 seconds )
- Cookie parser
- Session security
- File streams
- Templating engine
- Easy Routing
- Middlewares
- Logging
- Static Routes
- Request timeout

To run:

1) Install latest NodeJs 
2) Navigate to the folder where the files are
3) npm install
4) node index.js

