const socketLocation = 'timklein.tk:8009';

let isInit = false;

let maxV = 3;
let acceleration = 0.1;
let rotIncrease = 0.05;

let tankWidth = 15;
let tankLength = 20;
let barrelLength = 5;
let barrelWidth = 3;
let barrelOffSet = 10;

let tankBeginX = 0;
let tankBeginY = 0;
let tankBeginR = 0;
let tankBeginV = 0;

let RED;
let YELLOW;
let GREEN;
let CYAN;
let BLUE;
let PURPLE;

let player; 
let enemies = [];

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

// ------- server recieves
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
    isInit = true;
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
        'timestamp': now
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
            player = new Player(id, GREEN, tankBeginX, tankBeginY, tankBeginR, tankBeginV);
        } if (true) {
            //console.log("no match :(");
            enemies.push(new Enemy(id, RED, data.state.players[id]['x'], data.state.players[id]['y'], data.state.players[id]['r'], data.state.players[id]['v']));
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
    RED = color(255,0,0);
    YELLOW = color(255,255,0);
    GREEN = color(0,255,0);
    CYAN = color(0,255,255);
    BLUE = color(0,0,255);
    PURPLE = color(255,0,255);
    

    var canvas = createCanvas(400, 400);
    canvas.parent('canvasholder');
    rectMode(CENTER);
    
}

function draw() {
    if(!isInit){
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

function updateCurrentState(){
    if(bufferStates.length < 2){
        return;
    }

    const tickTime = bufferStates[1].timestamp - bufferStates[0].timestamp;
    currentState.timestamp += 1000 / frameRate();
    const progress = cap((currentState.timestamp - bufferStates[0].timestamp) / tickTime - 1,0,1);
    // console.log(bufferStates[1].timestamp, bufferStates[0].timestamp);

    for (const [key, nps] of Object.entries(bufferStates[1].players)){
        if(key in bufferStates[0].players){
            const pps = bufferStates[0].players[key];

            if(currentState.players[key] !== undefined){
                const cps = currentState.players[key];

                const new_v = cap(linearInter(pps['v'], nps['v'], progress), cps.v - acceleration * 1.05, cps.r + acceleration * 1.05);
                const new_r = cap(linearInter(pps['r'], nps['r'], progress), cps.r - rotIncrease * 1.05, cps.r + rotIncrease * 1.05);

                const max_delta_x = abs(cos(new_r) * max(cps.v, pps.v, nps.v));
                const new_x = cap(linearInter(pps['x'], nps['x'], progress), cps.x - max_delta_x, cps.x + max_delta_x);

                const max_delta_y = abs(sin(new_r) * max(cps.v, pps.v, nps.v));
                const new_y = cap(linearInter(pps['y'], nps['y'], progress), cps.y - max_delta_y, cps.y + max_delta_y);

                currentState.players[key] = {
                    'x': new_x,
                    'y': new_y,
                    'r': new_r,
                    'v': new_v,
                }

            }else{
                currentState.players[key] = {
                    'x': linearInter(pps['x'], nps['x'], progress),
                    'y': linearInter(pps['y'], nps['y'], progress),
                    'r': linearInter(pps['r'], nps['r'], progress),
                    'v': nps['v']
                }
            }


        }else{
            console.log(bufferStates[1])
            addPlayer(key, nps)
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


function drawTank(x,y,r,c) {
    translate(x, y);
    rotate(r);
    stroke(c);
    rect(0, 0, tankLength, tankWidth);
    rect(barrelOffSet,0,barrelOffSet + barrelLength,barrelWidth);
    rotate(-r);
    translate(-x, -y);
}


function cap(x, min, max) {
    if (min <= x && x <= max)
        return x;
    if (min > x)
        return min;
    return max;
}

function linearInter(start, end, progress){
    return (end - start) * progress + start;
}