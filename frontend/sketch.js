let bullet;

function setup() {
    createCanvas(400, 400);
    bullet = new Bullet(100,100,0,1);
}

function draw() {
    background(51,52,0);
    //bullet.x = mouseX;
    //bullet.y = mouseY;
    bullet.update();
    bullet.draw();
    
    //rect(10,10,10,10);
}






class Bullet {
    constructor(x, y, r, v) {
        this.pos = createVector(x, y);
        this.v = v;
        this.r = r;
        this.draw = function () {
            rect(this.x, this.y, 20, 20);
        };
        this.update = function() {
            this.pos.x += cos(r)*v;
            this.pos.y += sin(r)*v;
        }
    }
}
