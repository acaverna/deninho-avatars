function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const socket = io('https://deninhoavatars.herokuapp.com:3000/');
var clientId
totalUsers = [];

channel = 'davibusanello';

socket.on('connect', () => {
  clientId = socket.id;
  socket.emit('connectChannel', { id: clientId, channel: channel });

  setInterval(() => {
    socket.emit('getUsers', { id: clientId, channel });
  }, 3000);
  socket.on('users', useUsers);
  socket.on('changeDeninho', changeDeninho)
  socket.on('pingDeninho', pingDeninho)
  socket.on('moveDeninho', moveDeninho)
});

function useUsers(users) {
  totalUsers = users;
  totalUsers.forEach(showUsers);
  console.log(totalUsers)
}

function changeDeninho(data){
  foundedIndex = -1
  deninhos.forEach((deninho, index) => {
    if (deninho.name == data.nick){
      foundedIndex = index
    }
  })

  if (foundedIndex == -1){
    return
  }
  deninhosPossiblity = ['vampiro', 'denatal', 'dourado', 'normal']
  if (deninhosPossiblity.includes(data.deno)){
    deninhos[foundedIndex].changeImage(data.deno)
    deninhos[foundedIndex].image = data.deno
  }
}

function pingDeninho(data){
  deninhos.forEach((deninho) => {
    if (deninho.name == data.nick){
      deninho.changeImage('ping')
      setTimeout(() => {
        deninho.changeImage(deninho.image)
      }, 4000)

    }
  })
}

function moveDeninho(data){
  deninhos.forEach((deninho) => {
    if (deninho.name == data.nick){
      switch (data.position){
        case 'top':
          position = [displayWidth / 2, 30]
          break
        case 'bottom':
          position = [displayWidth / 2, displayHeight - 30]
          break
        case 'left':
          position = [30, displayHeight / 2]
          break
        case 'right':
          position = [displayWidth - 30, displayHeight / 2]
          break
        case 'top-left':
          position = [30, 30]
          break
        case 'top-right':
          position = [displayWidth - 30, 30]
          break
        case 'bottom-left':
          position = [30, displayHeight - 30]
          break
        case 'bottom-right':
          position = [displayWidth - 30, displayHeight - 30]
          break
        case 'center':
          position = [displayWidth / 2, displayHeight / 2]
          break
        default:
          position = false
      }
      console.log(position)

      if (position){
        deninho.setSpeed(0, 0)
        deninho.position.x =  position[0]
        deninho.position.y =  position[1]
      }
    }
  })
}

var textCanvas;
var deninhos

function setup() {

  deninhos = new Group()

  createCanvas(displayWidth, displayHeight);
  textCanvas = createGraphics(displayWidth, displayHeight);

  setInterval(() => {
    totalUsers.forEach(showUsers);
    deninhos.forEach(deletePlayers);
  }, 5000);

  setInterval(moveDeninhos, 10000);
}

function showUsers(user) {
  exists = false;
  deninhos.forEach((deninho) => {
    if (deninho.name == user) {
      exists = true;
    }
  });

  if (!exists) {
    x = getRandomArbitrary(0, displayWidth);
    y = getRandomArbitrary(0, displayHeight);
    denoNormal = loadImage('https://i.imgur.com/SfPiDp1.png')
    denoVampiro = loadImage('https://i.imgur.com/hvGyfXP.png')
    denoDenatal = loadImage('https://i.imgur.com/rpkkNFl.png')
    denoDourado = loadImage('https://i.imgur.com/qlozhP6.png')
    denoPing = loadImage('https://i.imgur.com/RKCPa0x.png')

    denoSprite = createSprite(x, y);

    denoSprite.addImage('normal', denoNormal);
    denoSprite.addImage('vampiro', denoVampiro);
    denoSprite.addImage('denatal', denoDenatal);
    denoSprite.addImage('dourado', denoDourado);
    denoSprite.addImage('ping', denoPing);

    denoSprite.changeImage('normal')
    denoSprite.image = 'normal'
    denoSprite.name = user;
    deninhos.add(denoSprite)

    xOfText = calcXOfText(x, user);
  }
}

function moveDeninhos() {
  deninhos.forEach((deninho, index) => {
    x = getRandomArbitrary(0, displayWidth);
    y = getRandomArbitrary(0, displayHeight);

    deninho.setSpeed(0, 0);
    deninho.attractionPoint(0.2, x, y);

    xOfText = calcXOfText(x, deninho.name);
  });
}

function deletePlayers(deninho, index) {
  if (totalUsers.indexOf(deninho.name) == -1) {
    console.log(totalUsers)
    deninhos[index].remove()
    deninhos.slice(index, 1)
    socket.emit('exitUser', { id: clientId, user: deninho.name, channel });
  }
}

function calcXOfText(x, user) {
  return x - (textSize() / 2) * (user.length / 2);
}

function draw() {
  clear();

  deninhos.forEach((deninho) => {
    text(
      deninho.name,
      calcXOfText(deninho.position.x, deninho.name),
      deninho.position.y - 25,
    );
  });

  deninhos.collide(deninhos)
  deninhos.draw()

  drawSprites();
}
