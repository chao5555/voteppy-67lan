const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let votes = { candidate1: 0, candidate2: 0 };

// Serve the index.html file and other static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.emit('update votes', votes);

    socket.on('vote', (candidate) => {
        votes[candidate]++;
        io.emit('update votes', votes);
        io.emit('update chart', votes);
    });

    socket.on('reset', () => {
        votes = { candidate1: 0, candidate2: 0 };
        io.emit('update votes', votes);
        io.emit('update chart', votes);
    });

    socket.on('get votes', (callback) => {
        callback(votes);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
