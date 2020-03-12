const socketLocation = 'timklein.tk:8009';

let maxV = 3;

let player; 
let enemies = [];

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

let bufferStates = [];
let currentState = {
    "players": {},
    "timestamp": Date.now()
};

// make connection
var socket = io(socketLocation);

socket.on('init', (data) => { // first connection
    //console.log("received init with data");
    //console.log(data);
    
    //console.log("socket.id: " + socket.id);
    initPlayers(data);
});

socket.on('new', (data) => { // new player
    //console.log("new player joins the game");
    //console.log(data);

    addPlayer(data);
});

// update from server
socket.on('update_state', (data) => {
    const now = Date.now()

    bufferStates.push({
        'players': data['players'],
        'timestamp': now // bufferState[2] (wordt bufferState[1]) is hetzelfde als currentState timestam
    })
    
    currentState.timestamp = now; 

    if(bufferStates.length > 2){
        bufferStates.shift();
    }
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
            enemies.push(new Enemy(id, color(255,0,0), data.state.players[id]['x'], data.state.players[id]['y'], data.state.players[id]['r'], data.state.players[id]['v']));
        }
    }    
}

function addPlayer(id, player) {
    console.log(`${id} joined.`);
    bufferStates[0]['players'][id] = player; // update local players data
    enemies.push(
        new Enemy(
            id, 
            color(255,0,0), 
            player.x, 
            player.y, 
            player.r, 
            player.v
        )
    );
    console.log(enemies)
    console.log(player)
}

function removePlayer(id) {
    for (var i=0; i<enemies.length; i++) {
        if (enemies[i].id == id) {
            enemies.splice(i,1);
            console.log(id + " left the game");
        }
    }
}

// ------- main game code

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('canvasholder');
    rectMode(CENTER);
    //noLoop();
}

function draw() {
    if(!player){
        return;
    }

    updateCurrentState();

    background(51);
    stroke(0);
    text("fps: " + round(frameRate()), 5, 10);
    
    player.update();
    player.draw();
    for (var i = 0; i<enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
    }
    // -- debugging 
    document.getElementById("1").innerHTML = Object.keys(currentState.players).length;
    /*document.getElementById("2").innerHTML = state.players[socket.id]['id'];
    document.getElementById("3").innerHTML = "";
    document.getElementById("4").innerHTML = ""; */
}

let progress;

function updateCurrentState(){
    if(bufferStates.length < 2){
        return;
    }

    const tickTime = bufferStates[1].timestamp - bufferStates[0].timestamp; // verschil tussen twee updates
    //const tickTime = 32;
    currentState.timestamp += 1000 / frameRate(); // advance one frame in seconds
    //const progress = (currentState.timestamp - bufferStates[0].timestamp) / tickTime - 1;
    progress = (currentState.timestamp - bufferStates[1].timestamp) / tickTime;
    if (progress > 1) {
        debugger;
    }
    console.log(`tickTime: ${tickTime}, Progress: ${progress}, frameTime: ${1000 / frameRate()}`);
    //console.log(progress);
    // console.log(bufferStates[1].timestamp, bufferStates[0].timestamp);

    for (const [key, next_player_state] of Object.entries(bufferStates[1].players)){
        if(key in bufferStates[0].players){
            const prev_player_state = bufferStates[0].players[key];
            currentState.players[key] = {
                'x': linearInter(prev_player_state['x'], next_player_state['x'], progress),
                'y': linearInter(prev_player_state['y'], next_player_state['y'], progress),
                'r': linearInter(prev_player_state['r'], next_player_state['r'], progress),
                // 'v': linearInter(prev_player_state['v'], next_player_state['v'], progress),
                'v': next_player_state['v']
            }
        }else{
            console.log(bufferStates[1])
            addPlayer(key, next_player_state)
        }

    };
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

function drawTank(x,y,r,c) {
    translate(x, y);
    rotate(r);
    stroke(c);
    rect(0, 0, 20, 15);
    rect(10,0,15,3);
    rotate(-r);
    translate(-x, -y);
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
/*            */
            if (bufferStates.length > 1 ) {
                //drawTank(bufferStates[0]['players'][socket.id].x, bufferStates[0]['players'][socket.id].y, bufferStates[0]['players'][socket.id].r, color(255,0,0));
                //drawTank(bufferStates[1]['players'][socket.id].x, bufferStates[1]['players'][socket.id].y, bufferStates[1]['players'][socket.id].r, color(0,0,255));
                drawTank(currentState['players'][socket.id].x, currentState['players'][socket.id].y, currentState['players'][socket.id].r, color(0,255,0));
                drawTank(this.x, this.y, this.r, color(255,255,255));
            } else {
            console.log(bufferStates.length);
            translate(this.x, this.y);
            rotate(this.r);
            stroke(this.c);
            rect(0, 0, 20, 15);
            rect(10,0,15,3);
            rotate(-this.r);
            translate(-this.x, -this.y);
            }
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
            if (currentState.players[this.id]) {
                this.x = currentState.players[this.id]['x'];
                this.y = currentState.players[this.id]['y'];
                this.r = currentState.players[this.id]['r'];
                this.v = currentState.players[this.id]['v'];

                this.v = cap(this.v, 0, maxV);
                
                this.x += cos(this.r)*this.v;
                this.y += sin(this.r)*this.v;
                
                this.x = cap(this.x, 0, width);
                this.y = cap(this.y, 0, height);
            }
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

function linearInter(start, end, progress){
    
//    return (end - start) * cap(progress, 0 ,1) + start;
    return (end - start) * progress + start;
}