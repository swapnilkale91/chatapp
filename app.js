const express = require('express');
const Filter = require('bad-words');
const filter = new Filter();
const app = express();
const path = require('path')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let port = process.env.port || 3000
let emoji = require('node-emoji')

io.on('connection', (socket) => {
  socket.emit('sendmessage', 'Welcome ! You have joined the chat room');
  socket.broadcast.emit('sendmessage', 'A new user has joined the chat room');

  socket.on('submitmessage', (message, callback) => {
    if (!filter.isProfane(message)) {
      io.emit('sendmessage', socket.username + ' : ' + emoji.emojify(message));
      callback('The message you sent was delivered');
    } else {
      callback('Do not use bad words !');
      io.emit('sendmessage', socket.username + ' : ' + filter.clean(message));
    }
  })

  socket.on('sendlocation', (location, callback) => {
    io.emit('sendmessage', location);
    callback('Location shared');
  })

  socket.on('username', function (username) {
    socket.username = username;
    io.emit('is_online', emoji.random().emoji + '<i>' + socket.username + ' join the chat..</i>');
  });

  socket.on('disconnect', () => {
    io.emit('is_online', emoji.random().emoji + '<i>' + socket.username + ' left the chat..</i>');
  })
});

const publicDir = path.join(__dirname, './')

app.use(express.static(publicDir))

app.get('/', function (req, res) {
  res.sendFile('./index.html', { root: __dirname });
})

server.listen(port);

