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

const connectedClients = []

io.on('connection', (socket) => {
  connectedClients.push(socket)
  socket.on('connectChannel', connectChannel)
  socket.on('getUsers', getUsers)
  socket.on('exitUser', exitUser)
});

function connectChannel(socket){
  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()

  foundedIndex = -1

  for (i = 0; i < connectedClients.length; i++){
    if (connectedClients[i].id == clientId){
      foundedIndex = i
    }
  }

  if (foundedIndex == -1){
    return;
  }

  connectedClients[foundedIndex].join(channel)
}

function getUsers(socket){
  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()

  foundedIndex = -1

  for (i = 0; i < connectedClients.length; i++){
    if (connectedClients[i].id == clientId){
      foundedIndex = i
    }
  }

  if (foundedIndex == -1){
    return;
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
      );
      connectedClients[foundedIndex].emit("users", total)
    })

}

function exitUser(socket){

  clientId = socket.id
  clientChannel = socket.channel.toLowerCase()
  userExited = socket.user

  foundedIndex = -1

  for (i = 0; i < connectedClients.length; i++){
    if (connectedClients[i].id == clientId){
      foundedIndex = i
    }
  }

  if (foundedIndex == -1){
    return;
  }

  console.log(userExited)
  connectedClients[foundedIndex].to(clientChannel).emit('exitUser', userExited)

}

http.listen(3000, () => {
  console.log('listening on *:3000');
});
