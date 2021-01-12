const express = require('express');
const fetch = require('node-fetch');
var cors = require('cors');
const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

clients = new Map()

io.on('connection', (socket) => {
  clients.set(socket.id, socket)
  socket.on('connectChannel', connectChannel)
  socket.on('getUsers', getUsers)
  socket.on('exitUser', exitUser)
  socket.on('pingDeninho', pingDeninho)
  socket.on('moveDeninho', moveDeninho)
  socket.on('changeDeninho', changeDeninho)

});

function connectChannel(socket){
  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()

  socketConnected = clients.get(clientId)

  if (!socketConnected){
    return
  }

  socketConnected.join(clientChannel)
}

function getUsers(socket){
  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()

  socketConnected = clients.get(clientId)
  if (!socketConnected){
    return
  }

  let url = `https://tmi.twitch.tv/group/user/${clientChannel}/chatters`;

  let settings = { method: 'Get' };

  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      const total = [].concat(
        json.chatters.vips,
        json.chatters.moderators,
        json.chatters.viewers,
        json.chatters.broadcaster,
      );
      socketConnected.emit("users", total)
    })

}

function exitUser(socket){

  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()
  userExited = socket.user

  socketConnected = clients.get(clientId)
  if (!socketConnected){
    return
  }

  io.to(clientChannel).emit('exitUser', userExited)

}

function changeDeninho(socket){
  deno = socket.deno
  nick = socket.nick
  channel = socket.url.replace('#','')

  io.to(channel).emit('changeDeninho', {deno, nick})
}

function pingDeninho(socket){
  console.log(socket)
  nick = socket.nick
  channel = socket.url.replace('#','')

  io.to(channel).emit('pingDeninho', {nick})
}

function moveDeninho(socket){
  console.log(socket)
  nick = socket.nick
  position = socket.position
  channel = socket.url.replace('#','')


  io.to(channel).emit('moveDeninho', {nick, position})
}

http.listen(3000, () => {
  console.log('listening on *:3000');
});
