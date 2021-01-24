const io = require('socket.io-client');

const socket = io('http://localhost:3000');
const clientId = socket.id

socket.on('connect', () => {
  const clientId = socket.id;

  const tmi = require('tmi.js');
  const options = require('./options');

  const client = new tmi.client(options);

  url = options.channels[0];

  client.connect();

  client.on('connected', (address, port) => {
    channel = url.replace('#','')
    socket.emit('connectChannel', { id: clientId, channel: channel });
  });

  socket.on('exitUser', (socket) => {
    console.log(socket)
  })

  client.on('chat', (channel, user, message, self) => {
    messageSplited = message.split(' ')
    if (messageSplited[0] == '!deninho' && messageSplited.length == 2) {
      deninhos = ['vampiro', 'denatal', 'dourado', 'normal']
      if (deninhos.includes(messageSplited[1])){
        client.action(url, `${user.username}, changed your deninho`);
        socket.emit('changeDeninho', {
          deno: messageSplited[1],
          nick: user.username,
          url: channel,
        });
      }
      else{
        client.action(url, `${user.username}, pega um deninho certo seu doido`);
      }
    }
    if (messageSplited[0] == '!pingdenim'){
      console.log(messageSplited)
      socket.emit('pingDeninho', {
        nick: user.username,
        url: channel,
      })
    }

    if (messageSplited[0] == '!mover' && messageSplited.length == 2){
      console.log(messageSplited)
      positions = ['bottom', 'top', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center']
      if (positions.includes(messageSplited[1])){
        socket.emit('moveDeninho', {
          nick: user.username,
          url: channel,
          position: messageSplited[1]
        })
      }
    }
  });
});
