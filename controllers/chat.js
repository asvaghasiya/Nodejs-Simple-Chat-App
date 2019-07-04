module.exports = {
	sendMessage: (data, socket) => {
		console.log("socket.roomName : ", socket.roomName)
		console.log("socket.peerName : ", socket.peerName)
		if(!socket.roomName && !socket.peerName){
			
			// if user have not joined any of the peer or room then return error
			socket.emit("res", { en: 'sendMessageResponse', data: {}, error: 'Please select any room or user first' });
			return;
		}

		// Check if user peer found
		if(socket.peerName) { 

			// If user is not sending message to their own self onl then send then messaege
			if(socket.peerName != socket.userName) { 
				socket.emit("res", { en: 'receivedMessage', data: { message: data.message, sender: socket.userName, peerName: socket.peerName } })
			}

			// Send message to peer
			chatClass.sendMessageToPeer(socket.peerName, data.message, socket.userName);
		} else if(socket.roomName) {

			// if user joined any room then broadcast it
			chatClass.sendMessageToRoom(socket.roomName, data.message, socket.userName);
		}
	},

	sendMessageToPeer: (peerName, message, sender) => {
		console.log("userClass.isUserExist(peerName) : ", userClass.isUserExist(peerName))

		// Check if the peer exist or not
		if(userClass.isUserExist(peerName)){ 

			// Check if the socket is alive or not of the peer
			if(io.sockets.connected[users[peerName]]) { 
				io.sockets.connected[users[peerName]].emit("res", { en: 'receivedMessage', data: { message: message, sender: sender, peerName: sender } })
			}
		}
	},

	sendMessageToRoom: (roomName, message, sender) => {
		console.log("sendMessageToRoom : roomName : ",roomName);

		// Sending message to specific room who have joined it
		// io.to(roomName).emit("res", { en: 'receivedMessage', data: { message: message, sender: sender, roomName: roomName, broadcast: true } })
		
		
		// Sendinfg message to all connected sockets
		io.sockets.emit("res", { en: 'receivedMessage', data: { message: message, sender: sender, roomName: roomName, broadcast: true } })
	}
}