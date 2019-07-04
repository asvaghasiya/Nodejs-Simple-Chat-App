selfName = null;
selfRoom = null;
selfPeer = null;
usersList = [];
roomsList = [];
messages = [];
socket = io('http://192.168.0.46:5020');
console.log("Connecting to socket.....")
socket.on('connect', function() {
    console.log("Socket Connected.................")
    let userName = prompt("Please enter user name", ""); 
    if (userName != null && userName.trim() != '') { 
        console.log("userName : ",userName);
        socket.emit('req', {
            en: 'connect',
            data: {
                userName: userName
            }
        });
    }
});

socket.on('res', function(data) {
    console.log("\nReceived Event : " + JSON.stringify(data));

    if (data.error) {
        alert(data.error);
        return;
    }

    switch (data.en) {
        case 'connectResponse':
            connectResponse(data.data);
            break;

        case 'updateRooms':
            updateRooms(data.data);
            break;

        case 'updateUsers':
            updateUsers(data.data);

        case 'setRoom':
            setRoom(data.data);
            break;

        case 'setPeer':
            setPeer(data.data);
            break;

        case 'receivedMessage':
            receivedMessage(data.data, true);
            break;

        default:
            console.log("Invalid Response Event : ", data.en);
    };
});

socket.on('reconnect', function() {
    console.log("Socket Reconnected...");
    window.location.reload();
})

socket.on('disconnect', function(track) {
    console.log("Socket Disconnected...", track);
    delete userName;
    $('.people-list ul').empty();
    $('.room-list ul').empty();
    $('.chatList').empty();
    selfName = null;
    selfRoom = null;
    selfPeer = null;
})

$('#addRoom').on('click', function(){
    createRoom();
})



function setPeer(data) {
    $('.chatList').empty();
    selfRoom = null;
    selfPeer = data.peerName;
    updateUsers({ users: usersList });
    renderMessages('peerName', data.peerName);
    setUnreadMessageCounter('peerName', data.peerName)
}

function setRoom(data) {
    $('.chatList').empty();
    selfPeer = null;
    selfRoom = data.roomName;
    updateRooms({ rooms: roomsList });
    renderMessages('roomName', data.roomName);
    setUnreadMessageCounter('roomName', data.roomName)
}

function receivedMessage(data, flag) {
    console.log("selfRoom : ",selfRoom)
    console.log("selfPeer : ",selfPeer)
    console.log("data.roomName : ",data.roomName)
    data.isRead = 0;
    if((data.broadcast && selfRoom == data.roomName) || (selfPeer == data.peerName))  {
        if(data.sender == selfName) {
            addMyMessage(data);
        } else {
            addOthersMessage(data);
        }
        data.isRead = 1;
    }
    if(flag)
        messages.push(data);

    if(data.broadcast && selfRoom != data.roomName) {
        setUnreadMessageCounter('roomName', data.roomName)
    } else if(selfPeer != data.peerName){
        setUnreadMessageCounter('peerName', data.peerName)
        
    }
}

function setUnreadMessageCounter(key, value) {
    let cnt = getUnreadMessageCounter(key, value);
    console.log("setUnreadMessageCounter : cnt : ",cnt, key, value);
    if(cnt == 0)
        return;

    if(key == 'roomName') {
        $('.room-list #' + value + ' > div > div').html(value + ' (' + cnt + ')');
    } else {
        $('.people-list #' + value + ' > div > div').html(value + ' (' + cnt + ')');
    }
    
}

function getUnreadMessageCounter(key, value) {
    let count = 0;
    for(var i = 0; i < messages.length; i++) {
        if(messages[i][key] == value && messages[i]['isRead'] == 0) {
            count++;
        }
    }
    return count;
}

function renderMessages(key, value) {
    console.log("key : ",key)
    console.log("value : ",value)
    console.log("messages : ",JSON.stringify(messages))
    for(var i = 0; i < messages.length; i++) {
        messages[i].isRead = 1;
        if(messages[i][key] == value) {
            receivedMessage(messages[i], false);
        }
    }
}

function updateRooms(data) {
    removeClicked({ en: 'joinRoom', data: { roomName: '' } });
    roomsList = data.rooms;
    console.log("updateRooms : ",data);
    $('.room-list ul').empty();
    let rooms = Object.keys(data.rooms);
    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i] == selfRoom) {
            addRoom(rooms[i]);
        }
    }

    for (var i = 0; i < rooms.length; i++) {
        if(rooms[i] != selfRoom) {
            addRoom(rooms[i]);
        }
    }
}
function updateUsers(data) {
    removeClicked()
    usersList = data.users;
    console.log("updateUsers : ",data);
    $('.people-list ul').empty();
    for (var i = 0; i < data.users.length; i++) {
        if(data.users[i] == selfPeer) {
            addUser(data.users[i]);
            break;
        }
    }
    for (var i = 0; i < data.users.length; i++) {
        if(data.users[i] != selfPeer) {
            addUser(data.users[i]);
        }
    }
}

function connectResponse(data) {
    selfName = data.userName;
    $('.chat-with').html(selfName)
    updateRooms(data);
    updateUsers(data);
}

function addUser(userName){
    if(userName == selfName)
        return;

    let css = {"cursor": "pointer"};
    if(userName == selfPeer) {
        delete css["cursor"];
        css["color"] = "yellow";
        css["font-weight"] = "bold";
    }
    let template = $(`
        <li class="clearfix" id="${userName}">
            <div class="about">
                <div class="name">${userName}</div>
            </div>
        </li>
    `).css(css);
    if(userName != selfPeer) {
        template = template.on('click', function() {
            let peerName = $(this).attr('id');
            socket.emit('req', { en: 'setPeer', data: { peerName: peerName } });
        });
    } else {
        template = template.addClass('clicked');
    }
        


    $('.people-list ul').append(template);
}

function removeClicked(data){
    let roomElements = $('.room-list .clicked')
    console.log("removeClicked : roomElements.length : ",roomElements.length);
    for (var i = roomElements.length - 1; i >= 0; i--) {
        $(roomElements[i]).css({"cursor": "pointer", "color": "white", "font-weight": "normal"}).on('click', function() {
            let value = $(this).attr('id');
            socket.emit('req', { en: 'joinRoom', data: { roomName: $(this).attr('id') } });
        });
    }

    let peerElements = $('.people-list .clicked')
    console.log("removeClicked : peerElements.length : ",peerElements.length);
    for (var i = peerElements.length - 1; i >= 0; i--) {
        $(peerElements[i]).css({"cursor": "pointer", "color": "white", "font-weight": "normal"}).on('click', function() {
            let value = $(this).attr('id');
            socket.emit('req', { en: 'setPeer', data: { peerName: $(this).attr('id') } });
        });
    }
}

function addRoom(roomName){
    let css = {"cursor": "pointer"};
    if(roomName == selfRoom) {
        css = {"cursor": "default", "color": "yellow", "font-weight": "bold"};
    } else {
        css = {"cursor": "pointer", "color": "white", "font-weight": "normal"};
    }
    let cnt = getUnreadMessageCounter('roomName', roomName);
    roomName = (cnt == 0) ? roomName : roomName + ' (' + cnt + ')';
    let template = $(`
        <li class="clearfix" id="${roomName}">
            <div class="about">
                <div class="name">${roomName}</div>
            </div>
        </li>
    `).css(css);
    if(roomName != selfRoom) {
        template = template.on('click', function() {
            let roomName =  $(this).attr('id');
            socket.emit('req', { en: 'joinRoom', data: { roomName: roomName } });
        });
    } else {
        template = template.addClass('clicked');
    }
    $('.room-list ul').append(template);
}

function addMyMessage(data) {
    let template = `
    <li class="clearfix">
        <div class="message-data align-right">
            &nbsp; &nbsp;
            <span class="message-data-name">
                ${data.sender}
            </span>
        </div>
        <div class="message other-message float-right">
            ${data.message}
        </div>
    </li>
    `;
    $('.chatList').append(template);
}

function addOthersMessage(data) {
    let template = `
    <li>
        <div class="message-data">
            <span class="message-data-name">
                ${data.sender}
            </span>
        </div>
        <div class="message my-message">
            ${data.message}
        </div>
    </li>
    `;
    template = 
    $('.chatList').append(template);
}

function createRoom(){
    var roomName = prompt("Please enter room name", ""); 
    if (roomName != null && roomName.trim() != '') { 
        console.log("roomName : ",roomName);
        socket.emit('req', { en: 'joinRoom', data: { roomName: roomName } });
    }
    
}

function sendMessage(){
    let message = $('#message-to-send').val();
    console.log("message : ",message);
    if(message != null && message != '') {
        socket.emit('req', { en: 'sendMessage', data: { message: message } });
        $('#message-to-send').val("");
    }
}