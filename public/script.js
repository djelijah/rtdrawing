var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);
context.lineWidth = 2;

var step = 10;
var lines = [];

// Create initial lines
for(var i = step; i <= size - step; i += step) {
    var line = [];
    for(var j = step; j <= size - step; j+= step) {
        var random = Math.random() * 10;
        var point = {x: j, y: i + random};
        line.push(point);
    } 
    lines.push(line);
}

// Draw lines
function drawLines() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        context.beginPath();
        context.moveTo(line[0].x, line[0].y);
        line.forEach(point => {
            context.lineTo(point.x, point.y);
        });
        context.stroke();
    });
}
drawLines();

canvas.addEventListener('click', (event) => {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var random = Math.random() * 10;
    var point = { x: x, y: y + random };
    lines.push([point]);

    drawLines();

    // Send new line to the server
    socket.emit('new-line', point);
});

// Setup WebSocket connection
var socket = io();

socket.on('new-line', (point) => {
    lines.push([point]);
    drawLines();
});

socket.on('initial-lines', (serverLines) => {
    lines = serverLines;
    drawLines();
});
