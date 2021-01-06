function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const socket = io('http://localhost:3000');
totalUsers = [];

channel = 'morgiovanelli';

socket.on('connect', () => {
  const clientId = socket.id;

  setInterval(() => {
    socket.emit('getUsers', { id: clientId, channel });
  }, 3000);
  socket.on('users', useUsers);
});

function useUsers(users) {
  totalUsers = users;
  totalUsers.forEach(showUsers);
}

var players = [];

var textCanvas;

function setup() {
  createCanvas(displayWidth, displayHeight);
  textCanvas = createGraphics(displayWidth, displayHeight);

  setInterval(() => {
    players.forEach(deletePlayers);
    totalUsers.forEach(showUsers);
    totalUsers = [];
  }, 5000);

  setInterval(moveDeninhos, 10000);
}

function showUsers(user) {
  exists = false;
  players.forEach((player) => {
    if (player.name == user) {
      exists = true;
    }
  });

  if (!exists) {
    x = getRandomArbitrary(0, displayWidth);
    y = getRandomArbitrary(0, displayHeight);
    img = 'https://i.imgur.com/SfPiDp1.png';

    denoSprite = createSprite(x, y);

    denoImg = loadImage(img);
    denoSprite.addImage(denoImg);

    denoSprite.name = user;
    players.push(denoSprite);

    xOfText = calcXOfText(x, user);
  }
}

function moveDeninhos() {
  players.forEach((player, index) => {
    x = getRandomArbitrary(0, displayWidth);
    y = getRandomArbitrary(0, displayHeight);

    player.setSpeed(0, 0);
    player.attractionPoint(0.2, x, y);

    xOfText = calcXOfText(x, player.name);
  });
}

function deletePlayers(player, index) {
  if (totalUsers.indexOf(player.name) == -1) {
    player.remove();
    delete players[index];
    socket.emit('exitUser', { id: clientId, user: player.name, channel });
  }
}

function calcXOfText(x, user) {
  return x - (textSize() / 2) * (user.length / 2);
}

function draw() {
  clear();

  players.forEach((player) => {
    text(
      player.name,
      calcXOfText(player.position.x, player.name),
      player.position.y - 25,
    );
  });

  drawSprites();
}
