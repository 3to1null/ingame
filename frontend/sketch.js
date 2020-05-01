// #region variable declaration
let state = new StateMachine({ // where to put dis?
    init: 'preInit',
    transitions: [
        {name: 'init', from: ['preInit', 'paused'], to: 'paused'},
        {name: 'pause', from: 'game', to: 'paused'},
        {name: 'play', from: 'paused', to: 'game'},
        {name: 'die', from: 'game', to: 'dead'},
        {name: 'respawn', from: 'dead', to: 'game'},
        {name: 'done', from: 'paused', to: 'game'},
        {name: 'done', from: 'editingLevel', to: 'game'},
        {name: 'done', from: 'editingControls', to: 'paused'},
        {name: 'escape', from: '*', to: 'game'},
        {name: 'editLevel', from: 'game', to: 'editingLevel'},
        {name: 'editControls', from: 'paused', to: 'editingControls'},
    ],
    methods: {
        onPause: () => {console.log("pausing")},
        onPlay: () => {console.log("playing")},
        onDie: () => {player.destroy()},
        onRespawn: () => {console.log("respawning")},
        onEscape: () => {console.log('escaping')},
        onEditLevel: () => {console.log('editing level')},
        onEditControls: () => {console.log('editing controlls')},
        onDone: () => {console.log("done")}
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
let tankCollisionRad = 30;
let barrelLength = 20;
let barrelWidth = 3;
let barrelOffSet = 5;

let bulletLength = 20;
let bulletWidth = 10;

let hpWidth = 100;
let hpHeight = 5;
let hpOffset = 15;
let nameOffset = 25;

let trackWidth = 3;
let trackHeight = 9;
let maxTrackSegmentLength = 12;
let trackLifeSpan = 255;
let trackFadingPoint = 0.5;

let roundTime = 3000; // in frames?

let audioDex = 0;
let maxAudioDex = 10;

// --- begin of things
let startingLevel = 1;
let tankBeginX = 0;
let tankBeginY = 0;
let tankBeginR = 0;
let tankBeginV = 0;
let startHp = 100;

// --- colors of things
let colors;
let environmentColors;
let backgroundColor;
let hpBackgroundColor;
let UIBackgroundColor;
let buttonColor;
let grassColor;
let colliderColor;
let trackColor;
let textColor;
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
    environmentColors = {
        'colliders': colors.red,
        'grass': colors.green,
        'snow': colors.white,
    }
    backgroundColor = color('#222');
    trackColor = color("#964B00");
    grassColor = colors.green;
    colliderColor = colors.red;
    //backgroundColor = colors.white;
    hpBackgroundColor = colors.red;
    hpColor = colors.green;
    UIBackgroundColor = color(51);
    buttonColor = color(61);
    textColor = colors.white;
}

// --- instances of things
let player; 
let enemies = [];
let splosions = [];

let images = [
    'blocks',
    'bridge',
    'bullet',
    'farm',
    'gear',
    'paris',
    'pillars',
    'square',
    // 'streets',
];
let animations = [
    {
        'name' : 'splosion',
        'firstFile' : 'src/image/splosion/splosion0.png',
        'lastFile' : 'src/image/splosion/splosion16.png',
    }
];

let sounds = [
    'boem',
    'shot',
];

let backgroundImage;

// --- level stuff
let level;
let newCollider = {
    'empty': true,
    'shape': Collider.shapes[0],
    'type': Collider.types[0]
};
let tree;
let treeDepth = 3;
let soundVolume = 0.05;


// #endregion

//#region server receives
let bufferStates = [];
let currentState = {
    "players": {},
    "timestamp": Date.now()
};

// --- make connection
let socket = io(socketLocation);

socket.on('init', (data) => { // first connection
    console.log(data);
    loadLevel(data.state.map);
    initPlayers(data);
    isInit = true;
    state.init();
});

// --- update from server
socket.on('update_state', (data) => {
    const now = Date.now()
    
    level.timeLeft = data.roundTimeRemaining
    
    if(Object.keys(data.players).length > enemies.length + 1){
        let enemyIDs = enemies.map(e => e.id);
    }

    bufferStates.push({
        'players': data['players'],
        'timestamp': now // bufferState[2] (wordt bufferState[1]) is hetzelfde als currentState timestam
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
    //console.log(data);
    player.onReceivedHit(data);
});

socket.on('kill', (data) => { // we made a kill!
    console.log("we did it!");
    player.score++;
})

socket.on('splosion', (data) => {
    splosions.push(new Animation(animations.splosion, data.x, data.y))
})

socket.on('new_round', (data) => {
    loadLevel(data);
    player.score = 0;
    player.hp = startHp;
    player.tracks = [new Track(this.x,this.y,this.r), new Track(this.x,this.y,this.r)];
});

socket.on('delete', (data) => {
    console.log("received a delete");
    console.log(data);
    removePlayer(data['id']);
});


function initPlayers(data) {
    console.debug("init players");
    for (let id in data.state.players) {
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
    for (let i=0; i<enemies.length; i++) {
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
    images = loadImages();
    animations = loadAnimations();
    sounds = loadSounds();
    // setVolume(soundVolume);
    createCanvas(0,0).parent('canvasholder');
    // tree = new GridCell(referenceWidth/2, referenceHeight/2,referenceWidth/2, referenceHeight/2);
    // tree.init(3);
    loadLevel(startingLevel);
    rectMode(CENTER);
    windowResized();
    initColors();
}

function draw() {

    
    if (state.is('preInit')) {return;}
    
    if (state.is('game')) { // main game loop
        background(backgroundColor);
        image(backgroundImage, 0, 0, width, height);
        // level.drawGrass();
        // drawTracks();
        // level.drawEnvironment();
        drawUI();
        updateCurrentState();
        updatePlayer();
        updateEnemies();
        drawSplosions();
        // tree.draw();
        // rectMode(CENTER)
        // rect(player.x*scale,player.y*scale, 30*scale,30*scale);
        // tree.query(player.x, player.y, 30, 30, []).forEach(g => {
        //     g.draw();
        // });
        // level.drawColliders();
        // level.timeLeft--;
    }
    
    if (state.is('paused') || state.is('editingControls')) { // options screend
        background(backgroundColor);
        drawButtons();
        updateCurrentState();
        updatePlayer();
        updateEnemies()
    }

    if (state.is('editingLevel')) {
        image(backgroundImage, 0, 0, width, height);
        level.drawEnvironment();
        if (!newCollider.empty) {
            new Collider(newCollider).draw(environmentColors[newCollider.type]);
        }
        updatePlayer();
        tree.draw();
        // tree.query(referenceWidth/2, referenceHeight/2, referenceWidth/2, referenceHeight/2, []).forEach(c => {
            // c.draw();
        // });
        text(`New Collider: type = ${newCollider.type}, shape = ${newCollider.shape}`, referenceWidth/2*scale, 20*scale);

    }

    //animation(animations.splosion);

}
//#endregion

//#region functions

let progress;

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
                const max_delta_y = abs(sin(new_r) * max(cps.v, pps.v, nps.v));
                
                let new_y, new_x;

                if (nps.x === tankBeginX && nps.y === tankBeginY) {
                    new_x = tankBeginX;
                    new_y = tankBeginY;
                } else {
                    new_x = cap(linearInter(pps['x'], nps['x'], progress), cps.x - max_delta_x, cps.x + max_delta_x);
                    new_y = cap(linearInter(pps['y'], nps['y'], progress), cps.y - max_delta_y, cps.y + max_delta_y);
                }

                currentState.players[key] = {
                    'id': pps['id'],
                    'x': new_x,
                    'y': new_y,
                    'r': new_r,
                    'v': new_v,
                    'tr': new_tr,
                    'hp': pps['hp'],
                    'c': pps['c'],
                    'name': pps['name'],
                    'bullets': pps['bullets'],
                    'score': pps['score'],
                }
                
            }else{ // als currentState.players[key] === undefined
                currentState.players[key] = {
                    'id': pps['id'],
                    'x': linearInter(pps['x'], nps['x'], progress),
                    'y': linearInter(pps['y'], nps['y'], progress),
                    'r': linearInter(pps['r'], nps['r'], progress),
                    'v': nps['v'],
                    'tr': linearInter(pps['tr'], nps['tr'], progress),
                    'c': nps['c'],
                    'hp': nps['hp'],
                    'name': nps['name'],
                    'bullets': nps['bullets'],
                    'score': nps['score'],
                }
            }


        }
    };
}

function updateEnemies() { 
    enemies.forEach((enemy) => {
        enemy.update();
        enemy.makeTracks();
        // enemy.limitTracks();
        enemy.drawTracks();
        enemy.draw();
        enemy.drawName();
        enemy.drawBullets();
    });
}

function updatePlayer() {
    player.update();
    player.makeTracks();
    player.drawTracks();
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

function loadSounds() {
    let a = {};
    sounds.forEach((s) => {
        a[s] = new Sound(s);
    });
    return a;
}

function loadImages() {
    let a = {};
    images.forEach(i => {
        a[i] = loadImage('src/image/'+i+'.png');
    })
    return a;
}

function loadAnimations() {
    let a = {};
    animations.forEach(i => {
        a[i.name] = loadAnimation(i.firstFile, i.lastFile);
    })
    return a;
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

function mod(n, m) {
    return ((n % m) + m) % m;
}

function iterate(array, member) { 
    // returns the next member from array
    return (array[(array.indexOf(member)+1)%array.length]);
}

function linearInter(start, end, progress){
    
//    return (end - start) * cap(progress, 0 ,1) + start;
    return (end - start) * progress + start;
}

function linearInterAngle(start, end, progress){
    start = start + Math.PI;
    end = end + Math.PI;
    let delta_angle = (end-start) % Math.PI * 2;
    return (start + (2 * delta_angle % (Math.PI * 2) - delta_angle) * progress) - Math.PI;
}

function rotatePointPoint(point, origin, angle) {
    return createVector(
        cos(angle) * (point.x - origin.x) - sin(angle) * (point.y - origin.y) + origin.x,
        sin(angle) * (point.x - origin.x) + cos(angle) * (point.y - origin.y) + origin.y
    );
}

function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

    let intersection;
  
    // calculate the distance to intersection point
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
  
      if(calcIntersection){
        // calc the point where the lines meet
        let intersectionX = x1 + (uA * (x2-x1));
        let intersectionY = y1 + (uA * (y2-y1));
      //}
      //if(calcIntersection){
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
    let left, right, top, bottom, intersection;
  
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

function collidePointCircle(x, y, cx, cy, d) {
    if( dist(x,y,cx,cy) <= d/2 ){
      return true;
    }
    return false;
};

function collidePointLine(px,py,x1,y1,x2,y2){
    let buffer = 0.1
    let d1 = dist(px,py, x1,y1);
    let d2 = dist(px,py, x2,y2);
    
    // get the length of the line
    let lineLen = dist(x1,y1, x2,y2);
    
    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
}

function collideLineCircle(x1,  y1,  x2,  y2,  cx,  cy,  diameter) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    let inside1 = collidePointCircle(x1,y1, cx,cy,diameter);
    let inside2 = collidePointCircle(x2,y2, cx,cy,diameter);
    if (inside1 || inside2) return true;

    // get length of the line
    /*let distX = x1 - x2;
    let distY = y1 - y2;
    let len = Math.sqrt( (distX*distX) + (distY*distY) );*/
    
    let len = dist(x1,y1,x2,y2);

    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));
    
    ellipse(closestX*scale,closestY*scale,5);
    //ellipse(x1*scale,y1*scale,2);
    //ellipse(x2*scale,y2*scale,2);
    
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = collidePointLine(closestX,closestY,x1,y1,x2,y2);
    if (!onSegment) return false;

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;


    // let distance = Math.sqrt((distX*distX) + (distY*distY));
    let distance = dist(cx,cy,closestX,closestY);
    if (distance <= diameter/2) {
      return true;
    }
    return false;
}

function collidePointRect(px,py,x1,y1,x2,y2) {
    return !(
        x1 > px ||
        px > x2 ||
        y1 > py ||
        py > y2
    )
}

function getPlayersByScore() {
    return Object.values(currentState.players).sort((a,b) => {return b.score - a.score});
    
}

function drawSplosions() {
    splosions.forEach(s => {
        s.playOnce();
    });
}

//#endregion