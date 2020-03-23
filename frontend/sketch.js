// #region variable declaration

let isInit = false;

let maxV = 3;
let acceleration = 0.1;
let rotIncrease = 0.05;
let bulletSpeed = 5;

let tankWidth = 15;
let tankLength = 20;
let barrelLength = 20;
let barrelWidth = 3;
let barrelOffSet = 5;

let tankBeginX = 0;
let tankBeginY = 0;
let tankBeginR = 0;
let tankBeginV = 0;

let screenWidth = 1000;
let screenHeight = 400;

let leftKey = 65;
let rightKey = 68;
let upKey = 87;
let downKey = 83;
let fireKey;

let player; 
let enemies = [];
let bullets = [];

let colors;

let controlls = {
    'changing': 0, // none, left, right, up, down, fire
    'left': leftKey,
    'right': rightKey,
    'up': upKey,
    'down': downKey,
    'fireWithMouse': true,
    'fire': fireKey,
    //'turretLeft': false,
    //'turrentRight': false
}

// #endregion

//#region server receives
let bufferStates = [];
let currentState = {
    "players": {},
    "timestamp": Date.now()
};

// --- make connection
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

// --- update from server
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


function initPlayers(data) {
    console.log("init players");
    console.log(data);
    for (var id in data.state.players) {
        if (id == socket.id) {
            let colorKeys = Object.keys(colors);
            let randomColor = colorKeys[colorKeys.length * Math.random() << 0];
            // randomColor = "CYAN";
            player = new Player(id, randomColor, tankBeginX, tankBeginY, tankBeginR, tankBeginV);
        } else {
            let currentPlayer = data.state.players[id];
            enemies.push(new Enemy(
                id, 
                currentPlayer['c'], 
                currentPlayer['x'], 
                currentPlayer['y'], 
                currentPlayer['r'], 
                currentPlayer['v']
            ));
        }
    }    
}

function addPlayer(id, player) {
    console.log(`${id} joined.`);
    bufferStates[0]['players'][id] = player; // update local players data
    enemies.push(
        new Enemy(
            id, 
            player.c,
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
//#endregion

//#region main game code

function setup() {
    createCanvas(screenWidth,screenHeight).parent('canvasholder');
    rectMode(CENTER);
    
    colors = {
        'RED': color(255,0,0),
        'YELLOW': color(255,255,0),
        'GREEN': color(0,255,0),
        'CYAN': color(0,255,255),
        'BLUE': color(0,0,255),
        'PURPLE': color(255,0,255),
    };
}

function draw() {
    if(!isInit){return;}
    updateCurrentState();

    background(51);
    /*stroke(0);
    text("fps: " + round(frameRate()), 5, 10);*/
    
    player.update();
    player.draw();

    updateEnemies();
    updateBullets();
    debugPlayers();
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

                const new_v = cap(linearInter(pps['v'], nps['v'], progress), cps.v - acceleration * 1.05, cps.r + acceleration * 1.05); //waar komen deze 1.05 vandaan?
                const new_r = cap(linearInter(pps['r'], nps['r'], progress), cps.r - rotIncrease * 1.05, cps.r + rotIncrease * 1.05);
                const new_tr = linearInterAngle(pps['tr'], nps['tr'], progress);
                //console.log(progress, new_tr);

                const max_delta_x = abs(cos(new_r) * max(cps.v, pps.v, nps.v));
                const new_x = cap(linearInter(pps['x'], nps['x'], progress), cps.x - max_delta_x, cps.x + max_delta_x);

                const max_delta_y = abs(sin(new_r) * max(cps.v, pps.v, nps.v));
                const new_y = cap(linearInter(pps['y'], nps['y'], progress), cps.y - max_delta_y, cps.y + max_delta_y);

                currentState.players[key] = {
                    'x': new_x,
                    'y': new_y,
                    'r': new_r,
                    'v': new_v,
                    'tr': new_tr
                }

            }else{
                currentState.players[key] = {
                    'x': linearInter(pps['x'], nps['x'], progress),
                    'y': linearInter(pps['y'], nps['y'], progress),
                    'r': linearInter(pps['r'], nps['r'], progress),
                    'v': nps['v'],
                    'tr': linearInter(pps['tr'], nps['tr'], progress),
                }
            }


        }else{
            console.log('New player (step 1)')
            addPlayer(key, nps)
        }

    };
}
//#endregion

//#region controlls

function changeControlls() {
    controlls.changing = 1;
    let textBox = document.getElementById("controlls");
    textBox.innerHTML = "listening for left input...";
}

function changeFire () {
    document.getElementById("fireWithMouse").blur();
    if (document.getElementById("fireWithMouse").checked) {
        controlls.fireWithMouse = true;
    } else {
        controlls.fireWithMouse = false;
    }
    changeControlls();
}

function keyPressed() {
    //#region changing controlls DIT IS HECKA LELIJK
    let textBox = document.getElementById("controlls");
    switch(controlls.changing) {
        case 0: // the controlls dont need changing
            if (keyCode == controlls.fire) {
                player.fire();
            }
            break;
        case 1: // the left needs changing
            controlls.left = keyCode;
            textBox.innerHTML = "listening for right input...";
            controlls.changing++;
            break;
        case 2: // the right needs changing
            controlls.right = keyCode;
            textBox.innerHTML = "listening for up input...";
            controlls.changing++;
            break;
        case 3: // the up needs changing
            controlls.up = keyCode;
            textBox.innerHTML = "listening for down input...";
            controlls.changing++;
            break;
        case 4: // the down needs changing
            controlls.down = keyCode;
            if (controlls.fireWithMouse) { // end configuration early
                textBox.innerHTML = "click <u>here</u> to change controlls";
                //textBox.style.visibility = "invisible";
                controlls.changing = 0;
            } else {
                textBox.innerHTML = "listening for fire input...";
                controlls.changing++;
            }
            break;
        case 5: // the fire needs changing
            controlls.fire = keyCode;
            textBox.innerHTML = "click <u>here</u> to change controlls";
            //textBox.style.visibility = "invisible";
            controlls.changing = 0;
            break;
        default:
            alert("something went very wrong, this is not supposed to happen! error code 69 lmao");
            break;
    }
    //#endregion
}

function mousePressed() {
    if (controlls.fireWithMouse) {
        player.fire();
    }
}

//#endregion

//#region functions

function updateEnemies() { // maybe do something here to check the correct amount of enemies
    for (var i = 0; i<enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
    }
}

function updateBullets() {
    for (let i = bullets.length -1; i >= 0; i--) {
        let b = bullets[i];
        b.update();
        if (b.x == cap(b.x,0,screenWidth) && b.y == cap(b.y,0,screenHeight)) {
            bullets[i].draw();
        } else {
            bullets.splice(i,1);
        }
    }
}

function debugPlayers() {
    let table = document.getElementById("playerTable");
    table.innerHTML = `<tr><th>id</th><th>x</th><th>y</th><th>c</th></tr>`
    for (key in currentState.players) {
        let subject = currentState.players[key];
        table.innerHTML += `<tr><td>${key}</td><td>${subject.x}</td><td>${subject.y}</td><td>${subject.c}</td></tr>`;
        //console.log(currentState.players[key]);
    }
}

// moved this to Tank.draw()
/*function drawTank(x, y, r, c, tr) { 
    push();

    translate(x, y);
    rotate(r);
    stroke(colors[c]);
    rect(0, 0, tankLength, tankWidth);

    translate(barrelOffSet/2, 0);
    rotate(-r);

    rotate(tr);
    rectMode(CORNER);
    rect(-barrelOffSet/2, -barrelWidth/2, barrelLength, barrelWidth);

    pop();
}*/

function cap(x, min, max) {
    if (min <= x && x <= max)
        return x;
    if (min > x)
        return min;
    return max;
}

function isWithin(x, min, max) {
    return (x > min && x < max);
}

function linearInter(start, end, progress){
    return (end - start) * progress + start;
}
function linearInterAngle(start, end, progress){
    start = start + Math.PI;
    end = end + Math.PI;
    let delta_angle = (end-start) % Math.PI * 2;
    return (start + (2 * delta_angle % (Math.PI * 2) - delta_angle) * progress) - Math.PI;
}

//#endregion