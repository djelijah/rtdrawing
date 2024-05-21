const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let lines = [];

// Serve static files
app.use(express.static('public'));

// WebSocket connection
io.on('connection', (socket) => {
    // Send initial lines to the new client
    socket.emit('initial-lines', lines);

    socket.on('new-line', (point) => {
        lines.push([point]);
        socket.broadcast.emit('new-line', point);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
