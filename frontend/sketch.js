let bullet;

function setup() {
    createCanvas(400, 400);
    bullet = new Bullet(100,100,PI,1);
}

function draw() {
    background(51);
    //bullet.x = mouseX;
    //bullet.y = mouseY;
    bullet.update();
    bullet.draw();
    
    //rect(10,10,10,10);
}






class Bullet {
    constructor(x, y, r, v) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.r = r;
        this.draw = function () {
            rect(this.x, this.y, 20, 20);
        };
        this.update = function() {
            this.x += cos(r)*v;
            this.y += sin(r)*v;
        }
    }
}
