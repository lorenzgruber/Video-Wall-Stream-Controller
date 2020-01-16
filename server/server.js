const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let isStreamChangeable = true;
let streamIndex = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});

http.listen(3000, () => console.log('listening on *:3000'));

io.on('connection', (socket) => {
    socket.emit('join', {isStreamChangeable, streamIndex});
    socket.on('change-stream-buttons', data => {
        if(isStreamChangeable && streamIndex != data) {
            streamIndex = data;
            isStreamChangeable = false;
            io.emit('stream-closed', streamIndex);
            io.emit('change-stream', streamIndex);
        }
    });
    
    
    socket.on('stream-changed', () => {
        io.emit('stream-opened');
        isStreamChangeable = true;
    });
});