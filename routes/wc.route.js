//https://gist.github.com/martinsik/2031681
var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});

var clients = {  };
var queue   = {  };

router.post('/connect_chat', function(req, res, next) {
    addQueue(req.body.user_id);
    console.log("queue at " + req.session.user_id + " set to " +    queue[req.session.user_id]);
    res.status(200).send({ message: "Websocket id acknowledged"});
});


wss.on('request', function(request){
    console.log("HELLO");
});

wss.on('connection', function (connection, req) {
    console.log('1. server accepted connection');

    // ON MESSAGE
    connection.on('message', function (msg) 
    {
        console.log("-> server received message: " + msg);
        if(IsJsonString(msg))
        {
            var msgObj = JSON.parse(msg);
            if(!doesClientExist(msgObj.data['user_id']))
            {
                if          (msgObj.message === 'user_id')
                {
                    console.log(queue[msgObj.data['user_id']]);
                    if(!IS_NULL(queue[msgObj.data['user_id']]))
                    {
                        newClient(msgObj.data['user_id'], connection, undefined);
                        removeQueue(msgObj.data['user_id']);
                        connection.send(JSON.stringify({message:'user_id_accepted'}));
                        console.log("2. user id accepted");
                        return;
                    }
                }
            }
            else
            {
                if          (msgObj.message === 'friend_id_req')
                {
                    setFriend(msgObj.data['user_id'], msgObj.data['friend_id']);
                    connection.send(JSON.stringify({message:'friend_id_accepted'}));
                    
                    other_con =  clients[msgObj.data['friend_id']]['user_data']['con'];
                    other_con.send(JSON.stringify({message:'friend_id_accepted'}));
                    console.log("3. friend id requested acknowledged");
                }
                else if     (msgObj.message === "friend_message_send")
                {
                    user_id     = msgObj.data['user_id'];
                    friend_id   = clients[user_id]['user_data']['friend_id'];
                    friend_con  = clients[friend_id]['user_data']['con'];
                    console.log(friend_con);
                    // try {
                        friend_con.send(JSON.stringify({message:'friend_message_rec', 
                                                        chat_message: msgObj.data['chat_message']})
                                                    );
                    // } catch (error) {
                    //     console.log(error);
                    // }
                    // connection.send("message sent to: " + friend_id);
                }
            }
        }
    });

    // ON DISCONNECT
    connection.on('close', function(connection) {
        removeClient(connection);
    });
});

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/public/views/chat.html'));
});
function setFriend(user_id, friend_id){
    clients[user_id]['user_data']['friend_id'] = friend_id; //['con'];
}
function doesClientExist(user_id){
    return !IS_NULL(clients[user_id]); 
}
function newClient(user_id, con, friend_id){
    clients[user_id] = { user_data: 
                            {   con: con, 
                                friend_id: friend_id
                            }
                        };
    console.log(clients[user_id]);
}
function removeClient(conn){
    for(var client in clients){
        if(IS_NULL(client['user_data'])) {
            return;    
        }
        else{
            if(client['user_data']['con'] == conn){
                clients[client['client_id']] = undefined;
                return;
            }
        }
    };
}
function addQueue(user_id){
    queue[user_id] = true;
}
function removeQueue(user_id){
    queue[user_id] = undefined;
}
function firstNull(){
    for (var i = 0; i < 200000; i++){
        var val = clients[parseInt(i)];
        
        if(IS_NULL(val)){
            return parseInt(i);
        }
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}


module.exports = router;


