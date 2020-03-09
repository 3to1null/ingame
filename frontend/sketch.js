let bullet;

function setup() {
    createCanvas(400, 400);
    bullet = new Bullet(100,100,0,0);
}

function draw() {
    background(51);
    bullet.x = mouseX;
    bullet.y = mouseY;
    bullet.draw();
    stroke(255);
    rect(10,10,10,10);
}






class Bullet {
    constructor(x, y, h, v) {
        this.pos = createVector(x, y);
        this.vel = createVector(h, v);
        this.draw = function () {
            rect(this.x, this.y, 20, 20);
        };
    }
}
