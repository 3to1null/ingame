let maxV = 3;

let player; 
let enemys = [];

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

// ------- server recieves

const state = {
    "players":{}
};

// make connection
var socket = io('http://timklein.tk:8009');

socket.on('init', (data) => { // first connection
    console.log("received init with data");
    console.log(data);
    
    //console.log("socket.id: " + socket.id);
    initPlayers(data);
});

socket.on('new', (data) => { // new player
    console.log("new player joins the game");
    console.log(data);

    addPlayer(data);
});

// update from server
socket.on('update_state', (data) => {
    state['players'] = data['players']; // update local players data
    //loop(); // run game loop
});

socket.on('delete', (data) => {
    console.log("received a delete");
    console.log(data);
    removePlayer(data['id']);
});

// what to do with server recieves

function initPlayers(data) {
    console.log("init players");
    console.log(data);
    for (var id in data.state.players) {
        //console.log("checking id: " + id);
        if (id == socket.id) {
            //console.log("match!");
            player = new Player(id, color(0,255,0), 100, 100, 0, 0);
        } else {
            //console.log("no match :(");
            enemys.push(new Enemy(id, color(255,0,0), data.state.players[id]['x'], data.state.players[id]['y'], data.state.players[id]['r'], data.state.players[id]['v']));
        }
    }    
}

function addPlayer(data) {
    if (data['id'] != socket.id) {
        console.log("adding new enemy");
        console.log(data);
        state['players'] = data.state['players']; // update local players data
        enemys.push(new Enemy(data['id'], color(255,0,0), state.players[data['id']].x, state.players[data['id']].y, state.players[data['id']].r, state.players[data['id']].v));
    }
}

function removePlayer(id) {
    for (var i=0; i<enemys.length; i++) {
        if (enemys[i].id == id) {
            enemys.splice[i];
        }
    }
}

// update to server?

/*setInterval(() => {
    io.emit('update_state', state)
  }, 30)
*/  


// ------- main game code

function setup() {
    createCanvas(400, 400);
    rectMode(CENTER);
    //noLoop();
}

function draw() {
    if(!player)
        return;
    background(51);
    stroke(0);
    text("fps: " + round(frameRate()), 5, 10);
    
    player.update();
    player.draw();
    for (var i = 0; i<enemys.length; i++) {
        enemys[i].update();
        enemys[i].draw();
    }
    /*enemy.update();
    enemy.draw(); */
    //noLoop();
}

function keyPressed() {
    switch (keyCode) {
        case 37:
            inputs[0] = true;
            break;
        case 38:
            inputs[2] = true;
            break;
        case 39:
            inputs[1] = true;
            break;
        case 40:
            inputs[3] = true;
            break;
        case 32:
            //fire
        default:
            break;
    }
}

function keyReleased() {
    switch (keyCode) {
        case 37:
            inputs[0] = false;
            break;
        case 38:
            inputs[2] = false;
            break;
        case 39:
            inputs[1] = false;
            break;
        case 40:
            inputs[3] = false;
            break;
        //case 32:
        //    inputs[4] = false;
        default:
            break;
    }
}

class Bullet {
    constructor(x, y, r, v) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.r = r;
        this.draw = function () {
            point(this.x, this.y);
        };

        this.update = function() {
            this.x += cos(this.r)*this.v;
            this.y += sin(this.r)*this.v;
        };
        this.update = function() {
            this.x += cos(r)*this.v;
            this.y += sin(r)*this.v;
        }
    }
}

class Player {
    constructor(id, c, x, y, r, v) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.v = v;
        this.c = c;

        this.draw = function() {
            translate(this.x, this.y);
            rotate(this.r);
            stroke(this.c);
            rect(0, 0, 20, 15);
            rect(10,0,15,3);
            rotate(-this.r);
            translate(-this.x, -this.y);
        };

        this.update = function() {
            if (inputs[0])
                this.rotate(-0.05);
            if (inputs[1])
                this.rotate(0.05);
            if (inputs[2])
                this.v += 0.1;
            if (inputs[3])
                this.v -= 0.1;

            this.v = cap(this.v, 0, maxV);
            
            this.x += cos(this.r)*this.v;
            this.y += sin(this.r)*this.v;
            
            this.x = cap(this.x, 0, width);
            this.y = cap(this.y, 0, height);

            socket.emit('update_player', {
                'x': this.x,
                'y': this.y,
                'r': this.r,
                'v': this.v
            }
  )


        };

        this.rotate = function(dr) {
            this.r += dr;
        };
    }
}

class Enemy {
    constructor(id, c, x, y, r, v) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.v = v;
        this.c = c;

        this.draw = function() {
            translate(this.x, this.y);
            rotate(this.r);
            stroke(this.c);
            rect(0, 0, 20, 15);
            rect(10,0,15,3);
            rotate(-this.r);
            translate(-this.x, -this.y);
        };

        this.update = function() {

            this.x = state.players[this.id]['x'];
            this.y = state.players[this.id]['y'];
            this.r = state.players[this.id]['r'];
            this.v = state.players[this.id]['v'];
//            console.log(state.players[this.id]);
            /*if (inputs[0])
                this.rotate(-0.05);
            if (inputs[1])
                this.rotate(0.05);
            if (inputs[2])
                this.v += 0.1;
            if (inputs[3])
                this.v -= 0.1;*/

            this.v = cap(this.v, 0, maxV);
            
            this.x += cos(this.r)*this.v;
            this.y += sin(this.r)*this.v;
            
            this.x = cap(this.x, 0, width);
            this.y = cap(this.y, 0, height);
        };

        this.rotate = function(dr) {
            this.r += dr;
        };
    }
}

function cap(x, min, max) {
    if (min <= x && x <= max)
        return x;
    if (min > x)
        return min;
    return max;
}