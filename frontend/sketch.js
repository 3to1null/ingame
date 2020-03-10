let maxV = 5;

let player; 

let inputs = [false,false,false,false,false]; // left, right, up, down, fire
let bullets = [];

function setup() {
    createCanvas(400, 400);
    player = new Tank(100,100,0,0);
}

function draw() {
    background(51);
    player.update();
    player.draw();
    
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


class Tank {
    constructor(x, y, r, v) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.v = v;

        this.draw = function() {
            translate(this.x, this.y);
            rotate(this.r);
            rect(0, 0, 20, 20);
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

function cap(x, min, max) {
    if (min <= x && x <= max) {

    }
        return x;
    if (min > x)
        return min;
    return max;
}