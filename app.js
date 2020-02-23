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
