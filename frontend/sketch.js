// #region variable declaration
let isInit = false;
// let gameState = 0; /*
                /*0 = not inited
                1 = in main game loop
                2 = options menu
                3 = Dead AF

*/

state = new StateMachine({
    init: 'preInit',
    transitions: [
        {name: 'init', from: 'preInit', to: 'paused'},
        {name: 'pause', from: 'game', to: 'paused'},
        {name: 'play', from: 'paused', to: 'game'},
        {name: 'die', from: 'game', to: 'dead'},
        {name: 'respawn', from: 'dead', to: 'game'},
        {name: 'done', from: 'paused', to: 'game'},
        {name: 'done', from: 'editingLevel', to: 'game'},
        {name: 'done', from: 'editingControls', to: 'paused'},
        // {name: 'escape', from: 'game', to: 'paused'},
        // {name: 'escape', from: 'paused', to: 'game'},
        {name: 'escape', from: '*', to: 'game'},
        // {name: 'escape', from: 'editing', to: 'game'},
        {name: 'editLevel', from: 'game', to: 'editingLevel'},

        {name: 'editControls', from: 'paused', to: 'editingControls'},
    ],
    methods: {
        onPause: function() {console.log("pausing")},
        onPlay: function() {console.log("playing")},
        // onDie: function() {console.log("dying")},
        onDie: function() {player.destroy()},
        onRespawn: function() {console.log("respawning")},
        onEscape: function() {console.log('escaping')},
        onEditLevel: function() {console.log('editing level')},
        onEditControls: function() {console.log('editing controlls')},
    }
})

// --- speed of things
let upgradeDuration = 300; // in frames, so 300 is around 5 seconds
let maxV = 2;
let acceleration = 0.1;
let rotIncrease = 0.05;
let bulletSpeed = 5;
let bulletDamage = 10;

// --- size of things
let scale = 1; // this is for a screen of referenceWidth x referenceHeight
let referenceWidth = 1280
let referenceHeight = 720
let targetAspectRatio = 16/9;

let tankWidth = 15;
let tankLength = 20;
let barrelLength = 20;
let barrelWidth = 3;
let barrelOffSet = 5;

let bulletLength = 20;
let bulletWidth = 10;

let hpWidth = 100;
let hpHeight = 5;
let hpOffset = 15;
let nameOffset = 25;


// --- begin of things
let startingLevel = 0;
let tankBeginX = 0;
let tankBeginY = 0;
let tankBeginR = 0;
let tankBeginV = 0;
let startHp = 100;

// --- colors of things
let colors;
let backgroundColor;
let hpBackgroundColor;
let hpRedLine = 0.25;
let UIBackgroundColor;
let buttonColor;
let grassColor;
let colliderColor;
function initColors() {
    colors = {
        'black': color(0,0,0),
        'white': color(255,255,255),
        'red': color(255,0,0),
        'yellow': color(255,255,0),
        'green': color(0,255,0),
        'cyan': color(0,255,255),
        'blue': color(0,0,255),
        'purple': color(255,0,255),
    };
    backgroundColor = color('#222');
    grassColor = colors.green;
    colliderColor = colors.red;
    //backgroundColor = colors.white;
    hpBackgroundColor = colors.red;
    hpColor = colors.green;
    UIBackgroundColor = color(51);
    buttonColor = color(61);
}

// --- instances of things
let player; 
let enemies = [];
let bulletSprite;
let backgroundImage;

// --- level stuff
let level;
let addCollider = {'destination': "grass", "shape": "rect"};
let newCollider = {};

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
    initPlayers(data);
    isInit = true;
    // gameState = 1; // go to main game loop
    state.init();
});

/*socket.on('new', (data) => { // new player // obsolete
    addPlayer(data);
});*/

// --- update from server
socket.on('update_state', (data) => {
    const now = Date.now()
    // console.log(data.players)
    if(Object.keys(data.players).length > enemies.length + 1){
        let enemyIDs = enemies.map(e => e.id);
    }

    bufferStates.push({
        'players': data['players'],
        'timestamp': now
    })
    
    currentState.timestamp = now; 

    if(bufferStates.length > 2){
        bufferStates.shift();
    }
});

socket.on('player_join', (data) => {
    addPlayer(data['id'], data['player'])
})

socket.on('bullet_hit', (data) => {
    player.onReceivedHit();
})

socket.on('delete', (data) => {
    console.log("received a delete");
    console.log(data);
    removePlayer(data['id']);
});


function initPlayers(data) {
    console.debug("init players");
    for (var id in data.state.players) {
        if (id === socket.id) {
            let colorKeys = Object.keys(colors);
            let randomColor = colorKeys[colorKeys.length * Math.random() << 0];
            // randomColor = "CYAN";
            player = new Player(id, randomColor, tankBeginX, tankBeginY, tankBeginR, tankBeginV);
        } else { // someone els
            let selectedPlayer = data.state.players[id];
            enemies.push(new Enemy(
                id, 
                selectedPlayer['c'], 
                selectedPlayer['x'], 
                selectedPlayer['y'], 
                selectedPlayer['r'], 
                selectedPlayer['tr'], 
                selectedPlayer['hp'], 
                selectedPlayer['v']
            ));
        }
    }    
}

function addPlayer(id, newPlayer) {
    console.debug(`${id} joined.`);
    enemies.push(
        new Enemy(
            id, 
            newPlayer.c,
            newPlayer.x, 
            newPlayer.y, 
            newPlayer.r, 
            newPlayer.v,
            newPlayer.hp,
        )
    );
}

function removePlayer(id) {
    for (var i=0; i<enemies.length; i++) {
        if (enemies[i].id == id) {
            enemies.splice(i,1);
            console.log(id + " left the game");
        }
    }

    delete currentState['players'][id];
    delete bufferStates[0]['players'][id];
    delete bufferStates[1]['players'][id];
}
//#endregion

//#region main game code

function setup() {
    initColors();
    createCanvas(0,0).parent('canvasholder');
    windowResized();
    rectMode(CENTER);
    bulletSprite = loadImage('src/image/bullet.png');
    //backgroundImage = loadImage('src/image/streets.jpg');
    //input = createInput();
    //input.position(inputX,inputY);
    loadLevel(startingLevel);
}

function draw() {
    //if(!isInit){return;}
    if (state.is('preInit')) {return;}
    //if (gameState == 1) { // main game loop
    if (state.is('game')) { // main game loop
        background(backgroundColor);
        image(backgroundImage, 0, 0, width, height);
        level.drawGrass();
        drawUI();
        updateCurrentState();
        updatePlayer();
        updateEnemies();
        level.drawColliders();
    // } else if (gameState == 2) { // options screen
    } else if (state.is('paused') || state.is('editingControls')) { // options screen
        background(backgroundColor);
        drawButtons();
        //updateCurrentState();
        //updatePlayer();
        //newCollider.draw();
    }

    if (state.is('editingLevel')) {
        image(backgroundImage, 0, 0, width, height);
        level.drawGrass();
        updatePlayer();
        level.drawColliders();

    }
    
}
//#endregion

//#region functions

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
            const pps = bufferStates[0].players[key]; // PastPlayerState
            
            if(currentState.players[key] !== undefined){ // als currentstate.player is defined
                const cps = currentState.players[key]; // CurrentPlayerState

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
                    'tr': new_tr,
                    'hp': pps['hp'],
                    'c': pps['c'],
                    'name': pps['name'],
                    'bullets': pps['bullets'],
                }

            }else{ // als currentState.players[key] === undefined
                currentState.players[key] = {
                    'x': linearInter(pps['x'], nps['x'], progress),
                    'y': linearInter(pps['y'], nps['y'], progress),
                    'r': linearInter(pps['r'], nps['r'], progress),
                    'v': nps['v'],
                    'tr': linearInter(pps['tr'], nps['tr'], progress),
                    'c': nps['c'],
                    'hp': nps['hp'],
                    'name': nps['name'],
                    'bullets': nps['bullets'],
                }
            }


        }
    };
}

function updateEnemies() { 
    enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw();
        enemy.drawName();
        enemy.drawBullets();
    });
}

function updatePlayer() {
    player.update();
    player.draw();
    player.drawName();
    player.drawBullets();
}

function debugPlayers() {
    let table = document.getElementById("playerTable");
    table.innerHTML = `<span>currentState entries:</span><br>`
    for (key in currentState.players) {
        let subject = currentState.players[key];
        if (socket.id == key) {
            table.innerHTML += `<span style="background-color: ${subject.c}">${key} (you)<span><br>`;
        } else {
            table.innerHTML += `<span style="bacsground-color: ${subject.c}">${key}</span><br>`;            
        }
        
        
        //console.log(currentState.players[key]);
    }
}

function loadLevel(l) {
    level = new Level(levels[l]);
    backgroundImage = loadImage(level['backgroundImage']);
    console.log(level);
    
}

function windowResized() {
    let currentAspectRatio = windowWidth/windowHeight;
    if (currentAspectRatio < targetAspectRatio) { // te hoog // width is limiting
        resizeCanvas(windowWidth, windowWidth/targetAspectRatio);
        scale = windowWidth/referenceWidth;
    } else {
        resizeCanvas(windowHeight*targetAspectRatio, windowHeight);
        scale = windowHeight/referenceHeight;
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
    return (end - start) * progress + start;
}
function linearInterAngle(start, end, progress){
    start = start + Math.PI;
    end = end + Math.PI;
    let delta_angle = (end-start) % Math.PI * 2;
    return (start + (2 * delta_angle % (Math.PI * 2) - delta_angle) * progress) - Math.PI;
}

let rotatePointPoint = (point, origin, angle) => {
    return createVector(
        cos(angle) * (point.x - origin.x) - sin(angle) * (point.y - origin.y) + origin.x,
        sin(angle) * (point.x - origin.x) + cos(angle) * (point.y - origin.y) + origin.y
    );
};

function mod(n, m) {
    return ((n % m) + m) % m;
}

function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

    var intersection;
  
    // calculate the distance to intersection point
    var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      if(calcIntersection){
        // calc the point where the lines meet
        var intersectionX = x1 + (uA * (x2-x1));
        var intersectionY = y1 + (uA * (y2-y1));
      }
      if(calcIntersection){
        intersection = {
          "x":intersectionX,
          "y":intersectionY
        }
        return intersection;
      }else{
        return true;
      }
    }
    if(calcIntersection){
      intersection = {
        "x":false,
        "y":false
      }
      return intersection;
    }
    return false;
  }

function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {

    // check if the line has hit any of the rectangle's sides. uses the collideLineLine function above
    var left, right, top, bottom, intersection;
  
    if(calcIntersection){
       left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,true);
       right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,true);
       top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,true);
       bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,true);
       intersection = {
          "left" : left,
          "right" : right,
          "top" : top,
          "bottom" : bottom
      }
    }else{
      //return booleans
       left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
       right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
       top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
       bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
    }
  
    // if ANY of the above are true, the line has hit the rectangle
    if (left || right || top || bottom) {
      if(calcIntersection){
        return intersection;
      }
      return true;
    }
    return false;
  }
//#endregion