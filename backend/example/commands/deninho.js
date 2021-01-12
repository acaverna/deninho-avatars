function deninho(message, user, client, socket){
    if (message == '!deninho') {
      client.action(url, `${user.username}, changed your deninho`);
      socket.emit('changeDeninho', {deno: 'deninho-vampiro', nick: user.username, channel: url, id: socket.id})
    }
  }

  module.exports = deninho
