var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

console.log('Starting socket');

app.listen(8009);

const state = {
  "players":{}
};

const initWaitTime = 1000;

io.on('connection', (socket) => {
  let newPlayer = {
    "x": 0,
    "y": 0,
    "r": 0,
    "v": 0,
    "tr": 0,
    "c": "RED",
  };

  state["players"][socket.id] = newPlayer

  // Emit new player to all other players
  setTimeout(() => {socket.broadcast.emit('player_join', {
      "id": socket.id,
      "player": newPlayer
  })}, initWaitTime);

  // Emit state to new player
  setTimeout(() => {socket.emit('init', {
    'state': state
  })}, initWaitTime);


  socket.on('update_player', (data) => {
    state["players"][socket.id] = data;
  });

  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} closed connection for reason: ${reason}.`)
    io.emit('delete', {
      'id': socket.id
    });
    delete state["players"][socket.id];
  })
});

// Broadcast game state
setInterval(() => {
  io.emit('update_state', state)
}, 50)