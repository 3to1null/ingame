var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

console.log('Starting socket');

app.listen(8009);

const tickTime = 50;
const roundTicks = 100 * 20;
const levelAmount = 3;

const state = {
  "players":{},
  "roundTimeRemaining": roundTicks * tickTime
};

const initWaitTime = 1000;

let roundTicksRemaining = roundTicks;

io.on('connection', (socket) => {
  let newPlayer = {
    "x": 0,
    "y": 0,
    "r": 0,
    "v": 0,
    "tr": 0,
    "c": "red",
    'name': "unnamed",
    'bullets': [],
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

  socket.on('bullet_hit', (data) => {
    io.to(data['hit']).emit('bullet_hit', {'shotBy': socket.id})
  });

  socket.on('kill', (data) => {
    io.to(data.killer).emit('kill', data);
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
let lastUpdate;
setInterval(() => {
  let update = Date.now();

  if(update - lastUpdate > tickTime * 1.1){
    console.log(`Spend ${lastUpdate - update}ms on a frame!`)
  }

  state['roundTimeRemaining'] = roundTicksRemaining * tickTime;

  io.emit('update_state', state)

  if(roundTicksRemaining > 0){
    roundTicksRemaining -= 1;
  }else{
    roundTicksRemaining = roundTicks;
    io.emit('new_round', Math.floor(Math.random() * levelAmount))
  }
}, tickTime)