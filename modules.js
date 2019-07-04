module.exports = function(){
	
	// NPM Modules
	http = require('http');
	socketIO = require('socket.io');
	express = require("express");
	bodyParser = require("body-parser");
	ejs = require('ejs');

	// Global variables
	SERVER_PORT = process.argv[2] || 3000;
    SERVER_PROTOCOL = process.argv[3] || 'http';
    rooms = {};
    users = {};

	// Custom Modules
    userClass = require("./controllers/user")
    roomClass = require("./controllers/room")
	chatClass = require("./controllers/chat")
}