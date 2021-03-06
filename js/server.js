var io = require('socket.io'),
    express = require('express');

var app = express.createServer(),
    io = io.listen(app);

app.listen(3001);

io.sockets.on('connection', function (socket) {
    var clientId = socket.id;

    //Remote Control
    socket.emit('ack', { message: 'You are connected.' });

    socket.on('slideto', function(data) {
        console.log('slideto', data);
        socket.broadcast.emit('slideto', data);
    });


    //Voting
    socket.on('vote', function (data) {
        console.log(data);
        socket.broadcast.emit('vote', data, clientId);
        socket.emit('setenabled', false);
    });

    socket.on('openpoll', function(open) {
        socket.broadcast.emit('setenabled', open);
    });
});