const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let isStreamChangeable = true;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/controll.html');
});

http.listen(3000, () => console.log('listening on *:3000'));

io.on('connection', (socket) => {
    socket.emit('join', isStreamChangeable);
    socket.on('change-stream-buttons', data => {
        if(isStreamChangeable) {
            isStreamChangeable = false;
            io.emit('stream-closed');
            io.emit('change-stream', data);
        }
    });
    
    
    socket.on('stream-changed', () => {
        io.emit('stream-opened');
        isStreamChangeable = true;
    });
});