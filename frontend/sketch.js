let bullet;

function setup() {
    createCanvas(windowWidth, windowHeight);
    bullet = new Bullet(100,100,0,0);
}

function draw() {
    background(51);
    bullet.x = mouseX;
    bullet.y = mouseY;
    bullet.draw();
}





function Bullet(x,y,h,v) { //the class for a bullet
    this.pos = createVector(x,y);
    this.vel = createVector(h,v);

    this.draw = function () {
        rect(this.x, this.y, 20, 20);
    }

}