const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const server = app.listen(PORT);
const io = require('socket.io').listen(server);

const Filter = require('bad-words');
const filter = new Filter();
const emoji = require('node-emoji');
const path = require('path');

io.on('connection', (socket) => {
  socket.emit('sendmessage', 'Welcome ! You have joined the chat room');
  socket.broadcast.emit('sendmessage', 'A new user is trying to join the chat room');

  socket.on('submitmessage', (message, callback) => {
    if (!filter.isProfane(message)) {
      socket.broadcast.emit('sendmessage', socket.username + ': ' + emoji.emojify(message));
    } else {
      callback('Mind your words !');
      socket.broadcast.emit('sendmessage', socket.username + ': ' + filter.clean(message));
    }
  })

  socket.on('sendlocation', (location, callback) => {
    io.emit('sendmessage', location);
    callback('Location shared');
  })

  socket.on('username', function (username) {
    socket.username = username;
    io.emit('is_online', '<i>' + socket.username + ' join the chat..</i>');
  });

  socket.on('randomEmoji', (callback) => {
    callback(emoji.random().emoji);
  })

  socket.on('disconnect', () => {
    io.emit('is_online', '<i>' + socket.username + ' left the chat..</i>');
  })

  socket.on('istyping', (username) => {
    socket.broadcast.emit('istyping', username + ' is typing...');
  })
});

const publicDir = path.join(__dirname, './')

app.use(express.static(publicDir))

app.get('/', function (req, res) {
  res.sendFile('./index.html', { root: __dirname });
})
