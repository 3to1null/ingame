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
    "v": 0,
    "tr": 0,
  };

  // Give client time to load before sending state.
  setTimeout(() => {
    socket.emit('init', {
      'state': state
    });
  }, 1000);


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