# Deninho Avatars

Deninho Avatars is a project what you can show your viewers in the screen, being Deninho's. The viewers will can change the deninho type. The viewers can be a Vampire Deninho, a Golden Deninho,etc. And move their Deninho.

# Using in OBS

Create a OBS browser overlay, with any size (like 1920x1080, 1280x720,etc) with the URL `https://deninho-avatars.netlify.app?channel=[YOUR CHANNEL]`, like `https://deninho-avatars.netlify.app?channel=pachicodes`. And Deninho's will jump on the screen!

# Using chat commands

If you want, you can integrate Deninho Avatars with your chatbot. Accepting some [socket.io](https://socket.io/) connections from the source `https://deninhoavatars-backend.herokuapp.com/`

If you want to see a example, in `backend/example` you can see a simple NodeJS bot with the socket.io connections, hearing and emiting data.

## Change Deninho

To change certain Deninho, emit to `https://deninhoavatars-backend.herokuapp.com/` the token `changeDeninho`, passing the Deno (which can be `vampiro`, `denatal`, `dourado` or `normal`), the nick of the user, and the URL what is the channel name, like `pokemaobr`.

### Example

```javascript
socket.emit('changeDeninho', {
  deno: "vampiro",
  nick: "lexyca",
  url: "morgiovanelli",
});
```

## Ping Deninho

To "ping" (blink) certain Deninho, emit `pingDeninho`, passing the nick of the user, and the URL of the channel, like `narioDev`.

### Example

```javascript
socket.emit('pingDeninho', {
  nick: "kastr0walker",
  url: "tonhocodes",
})
```

## Move Deninho

To move certain Deninho, emit `moveDeninho`, passing the nick of the user, the position, which can be `bottom`, `top`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right` or `center`, and the URL of the channel, like `profbrunolopes`

### Example

```javascript
socket.emit('moveDeninho', {
  nick: "davibusanello",
  url: "ytapioca",
  position: "bottom"
})
```
