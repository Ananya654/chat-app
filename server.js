const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));


const users = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('newUser', (username) => {
        users[socket.id] = username || 'Stranger';
        console.log(`${username} joined the chat.`);
        io.emit('userJoined', `${username} joined the chat.`);
    });

    socket.on('chatMessage', (msg) => {
        console.log('Message received:', msg);
        io.emit('chatMessage', msg);
    });

    socket.on('userLeft', (username) => {
        console.log(`${username} left the chat.`);
        io.emit('userJoined', `${username} left the chat`);
        delete users[socket.id];
    });
    
    socket.on('disconnect', () => {
        const username = users[socket.id] || 'Stranger';
        console.log(`${username} disconnected.`);
        io.emit('userJoined', `${username} is disconnected`);
        delete users[socket.id];
    });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`running`);
});
