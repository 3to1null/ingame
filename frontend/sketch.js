let maxV = 3;

let player; 
let enemys = [];

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

// ------- server stuff

const state = {
    "players":{}
};

// make connection
var socket = io('timklein.tk:8009');

socket.on('init', (data) => { // first connection
    console.log(data);
    console.log("socket.id: " + socket.id);
    initPlayers(data.state);
});

// update from server
socket.on('update_state', (data) => {
    //console.log('update_state')
    state['players'] = data['players']; // update local players data
    loop(); // run game loop
})

function initPlayers(state) {
    console.log("init players");
    console.log(state);
    for (var id in state.players) {
        console.log("checking id: " + id);
        //console.log(state.players[id]);
        //console.log("socid: " + socket.id);
        if (id == socket.id) {
            console.log("match!");
            player = new Player(id, color(0,255,0), 100, 100, 0, 0);
        } else {
            console.log("no match :(");
            enemys.push(new Enemy(id, color(255,0,0), state.players[id].x, state.players[id].y, state.players[id].r, state.players[id].v));
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
    //player = new Player(socket.id, color(0,255,0),100,100,0,0);
    //enemy = new Enemy(1, color(255,0,0), 300, 300, 0, 0);
    noLoop();
}

function draw() {
    if(!socket.id)
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
    noLoop();
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