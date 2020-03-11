var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

console.log('Starting socket');

app.listen(8009);

const state = {
  "players":{}
};

io.on('connection', (socket) => {
  // On connection
  state["players"][socket.id] = {
    "x": 0,
    "y": 0,
    "r": 0,
    "v": 0
  };

  socket.emit('init', {
    'state': state,
    'new': socket.id // id of the newcommer
  });

  socket.on('update_player', (data) => {
    console.log(data);
    console.log("data received from: " + socket.id);
    state["players"][socket.id] = data;
  });

  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} closed connection for reason: ${reason}.`)
    socket.emit('delete', {
      'id': socket.id
    });
    delete state["players"][socket.id];
  })
});

// Broadcast game state every 30ms
setInterval(() => {
  io.emit('update_state', state)
}, 30)
