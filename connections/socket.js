module.exports = function(){

    if(SERVER_PROTOCOL == 'https') {
        
        // creating https secure socket server
        let options = {key: fs.readFileSync('../certificate/server.key'), cert: fs.readFileSync('../certificate/final.crt')};
        server = https.createServer(options, app);
    } else {

        // creating http non-secure socket server
        server = http.createServer(app);
    }


    io = socketIO(server,{
        transports: ['websocket', 'polling', 'xhr-polling', 'flashsocket'],
        pingInterval: 25000, // to send ping/pong events for specific interval (milliseconds)
        pingTimeout: 25000, // if ping is not received in the "pingInterval" seconds then milliseconds will be disconnected in "pingTimeout" milliseconds
    });

    io.sockets.on("connection", function(socket) {
        console.log("Socket Connected : ", socket.id, new Date());
        socket.on('req', function(data) {
            console.log("Received Event : " + JSON.stringify(data));

            /*
                convert userNmae, peerName, roomName to upper case if any of them found to overcome problem of the duplication
            */
            if(data.data.userName)
                data.data.userName = data.data.userName.substr(0, 10).toUpperCase();

            if(data.data.peerName)
                data.data.peerName = data.data.peerName.substr(0, 10).toUpperCase();

            if(data.data.roomName)
                data.data.roomName = data.data.roomName.substr(0, 10).toUpperCase();

            // handle all kind of events here
            switch (data.en) {
                case 'connect':
                    userClass.connect(data.data, socket);
                    break;

                case 'joinRoom':
                case 'setPeer':
                    if(!socket.userName){
                        return;
                    }
                    roomClass[data.en](data.data, socket)
                    break;

                case 'sendMessage':
                    chatClass[data.en](data.data, socket)
                    break;
            };
        });

        socket.on('disconnect', function(reason){
            console.log('Socket Disconnected......,', reason)
            // Handle disconnection event here
            if(socket.userName) {
                let userName = socket.userName;
                if(socket.roomName){
                    roomClass.leaveRoom({}, socket);
                } else if (socket.peerName) {
                    if(userClass.isUserExist(socket.peerName)){
                        roomClass.removePeer({}, io.sockets.connected[users[socket.peerName]]);
                    }
                }
                delete users[userName];
                io.emit('res', { en: 'updateUsers', data: { users: Object.keys(users) } })
            }

        })
    });

    
}