let maxV = 3;

let player; 
let enemy;

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

// ------- server stuff
var socket = io('timklein.tk:8009');

socket.on('init', (data) => {
    console.log(data);
});

socket.on('update_state', (data) => {
    console.log('update_state')
    loop();
})




// ------- main game code

function setup() {
    createCanvas(400, 400);
    rectMode(CENTER);
    player = new Player(0, color(0,255,0),100,100,0,0);
    enemy = new Enemy(1, color(255,0,0), 300, 300, 0, 0);
    noLoop();
}

function draw() {
    background(51);
    stroke(0);
    text("fps: " + round(frameRate()), 5, 10);
    
    player.update();
    player.draw();
    enemy.update();
    enemy.draw();
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