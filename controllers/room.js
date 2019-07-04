module.exports = {
	joinRoom:(data, socket) => {
		console.log("joinRoom data : ",data)
		console.log("joinRoom socket.userName : ",socket.userName)
		
		// If user have joined any room before then remove that user first from room
		if(socket.roomName){
			roomClass.leaveRoom(data, socket);
		}

		// If user has any peerName then remove it first
		if(socket.peerName){
			roomClass.removePeer(data, socket);
		}

		// register roomName in rooms object
		rooms[data.roomName] = [socket.un];
		console.log("joinRoom : data.roomName : ",data.roomName);

		// join client socket to specific room using 'join()' method
		socket.join(data.roomName);

		// assign roomName property ot check user's current room
		socket.roomName = data.roomName;


		socket.emit('res', { en: 'setRoom', data: { roomName: data.roomName } })

		// Request all clients to update the rooms
		io.emit('res', { en: 'updateRooms', data: { rooms: rooms } })
	},

	leaveRoom: (data, socket) => {
		/*
			User can leave chat room from here
		*/
		console.log("leaveRoom data : ",data)
		console.log("leaveRoom socket.userName : ",socket.userName)
		
		if(!socket.roomName) {
			// return user if user don't have roomName
			return;
		}

		let roomName = socket.roomName;

		// leave client docket using 'leave()' method
		socket.leave(roomName); 

		// delete roomName property 
		delete socket.roomName; 

		roomClass.removeRoomMember(roomName, socket.userName);
	},

	isRoomAvailable: (roomName) => {
		// check for room existence
		return (typeof rooms[roomName] != 'undefined') ? true : false;
	},

	removeRoomMember: (roomName, userName) => {
		// Remove specific user from room
		if(!roomClass.isRoomAvailable(roomName))
			return;

		// check if user exists in the room or not
		if(rooms[roomName].indexOf(userName) != -1){ 

			// removing member from the room
			rooms[roomName].splice(rooms[roomName].indexOf(userName), 1); 
		}

		// remove rgistered room if nobody is there in the room
		if(rooms[roomName].length == 0) {
			delete rooms[roomName];
			io.emit('res', { en: 'updateRooms', data: { rooms: rooms } })
		}
	},

	addRoomMember: (roomName, userName) => {
		// Add specific member to room
		if(!roomClass.isRoomAvailable(roomName)) {
			rooms[roomName] = [];
		}

		if(rooms[roomName].indexOf(userName) == -1){
			rooms[roomName].push(userName);
		}
	},

	setPeer: (data, socket) => {
		console.log("setPeer data : ",data)
		console.log("setPeer socket.userName : ",socket.userName)
		if(!userClass.isUserExist(data.peerName)){
			return;
		}

		// if user have already peerName then unset is first
		if(socket.peerName){
			roomClass.removePeer(data, socket);
		}

		// if user have already joined any room then remove that user from the table first
		if(socket.roomName) {
			roomClass.leaveRoom(data, socket);
		}

		// assign peerName property ot check user's current peer
		socket.peerName = data.peerName; 

		socket.emit('res', { en: 'setPeer', data: { peerName: data.peerName } })
	},

	removePeer: (data, socket) => {
	// unset peerName property of the socket
		delete socket.peerName;
	}
}