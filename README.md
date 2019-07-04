# Simple chat app using NodeJS & Socket.io
This app has functionality for public & private chat. This app is built using basics of nodejs & socket.io. User can chat privately to any user & also can create or join the room.
## Code Structrue
```bash
├── connections
│   ├── app.js
│   └── socket.js
├── controllers
│   ├── chat.js
│   ├── room.js
│   └── user.js
├── public
│   ├── css
│   │   └── *.css
│   ├── js
│   │   └── *.js
├── routes
│   └── index.js
├── views
│   └── *.html
├── index.js
├── modules.js
├── package.json
├── .gitignore
└── README.md
```

## Setup Project

## Install Node
[https://nodejs.org/en/](https://nodejs.org/en/)

# Install Dependencies
	npm install

# Start Server
	



## connections directory

This directory includes all kind of connection files. You can add your own new connection file.

#### app.js

File contains app configuration like path to serve static files, view engine or set request/response headers.

#### socket.js

File contains code that how app can be bind with express app. It also does event handling regarding the app features & error handling.

## controllers directory

This directory includes all controllers to handle different operations.

## public directory

This directory is used to server static files & ti will also have different type of assets like js, css, images etc.

## routes directory

This directory have different route filed which handle REST APIs.

## views directory

This directory have all front-end views like html, ejs etc.

## index.js

This file is the initiator file of the server which inherits all of the above things.

## modules.js

This file initiates all type of the npm packages and global variables. (Note: This file will be never comitted & push on the repository.)