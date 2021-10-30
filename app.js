// creating express instance
var express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require('socket.io')(server)
 
// creating socket io instance
 
// start the server
server.listen(3000, function () {
    console.log("Server started");
});
var users = [];
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})
io.on("connection", function (socket) {
    console.log("User connected", socket.id);
    // attach incoming listener for new user
    socket.on("user_connected", function (username) {
        // save in array
        users[username] = socket.id;
        // socket ID will be used to send message to individual person
        // notify all connected clients
        io.emit("user_connected", username);
    });
    // listen from client inside IO "connection" event
socket.on("send_message", function (data) {
    // send event to receiver
    console.log(data);
    var socketId = users[data.receiver];
    io.to(socketId).emit("new_message", data);
});
});