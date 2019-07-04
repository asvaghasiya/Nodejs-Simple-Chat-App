module.exports = {
	connect: (data, socket) => { // 
		/*
			Users need to be registered with their unique name on the server after the connection
		*/
		if(userClass.isUserExist(data.userName)) {
			socket.emit("res", { en: 'connectResponse', data: {}, error: 'Please enter different user name or try after some time' })
			return;
		}

		users[data.userName] = socket.id; // register userName in users array
		socket.userName = data.userName;
		socket.emit("res", { en: 'connectResponse', data: { userName: data.userName, rooms: rooms, users: Object.keys(users) } });

		io.emit('res', { en: 'updateUsers', data: { users: Object.keys(users) } }) 
	},

	isUserExist: (userName) => {
		/*
			check user existence here
		*/
		return (typeof users[userName] != 'undefined') ? true : false;
	}
}