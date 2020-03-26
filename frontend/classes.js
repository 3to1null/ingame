class Bullet {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.v = bulletSpeed;
        this.r = r;
        this.needsCleanup = false;
    }

    updateInternals(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    update() {
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;

        if(this.x !== cap(this.x, 0, referenceWidth) || this.y !== cap(this.y, 0, referenceHeight)){
            this.needsCleanup = true;
        }

    };

}


class Tank {
    constructor(id, c, x, y, r, v, tr) {
        this.id = id;
        
        this.x = x;
        this.y = y;
        this.r = r;
        this.v = v;

        this.tr = tr;
        this.hp = 100;
        this.name = c;
        this.c = c;

        this.bullets = {};
    }

    draw() {
        push();
        translate(this.x * scale, this.y * scale);
        rotate(this.r);
        fill(colors[this.c]);
        rect(0, 0, tankLength * scale, tankWidth * scale);
        translate(barrelOffSet/2 * scale, 0);
        rotate(-this.r);
        rotate(this.tr);
        rectMode(CORNER);
        rect(-barrelOffSet/2 * scale, -barrelWidth/2 * scale, barrelLength * scale, barrelWidth * scale);
        pop();
    };
    
    drawHp() {
        fill(hpBackgroundcolor);
        rect(this.x * scale, this.y * scale, hpWidth * scale, hpHeight * scale);
    }

    update() {
        this.v = cap(this.v,0,maxV);
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;
        this.x = cap(this.x,0,width/scale);
        this.y = cap(this.y,0,height/scale);
    }

    rotate(dr) {
        this.r += dr;
    }

    rotateTurret(dr){
        this.tr += dr;
    }

    drawBullets() { // nts push and pop
        stroke(colors[this.c]);   
        //point(this.x * scale, this.y * scale); 
        for (const [bulletID, bullet] of Object.entries(this.bullets)){
            bullet.update()
            point(bullet.x * scale, bullet.y * scale);
        }
        stroke(colors.black);
    }
}

class Player extends Tank {
    update() {
        if (keyIsDown(controls.left)){
            this.rotate(-rotIncrease);
        }
        if (keyIsDown(controls.right)){
            this.rotate(rotIncrease);
        }
        if (keyIsDown(controls.up)){
            this.v += acceleration;
        }
        if (keyIsDown(controls.down)){
            this.v -= acceleration;
        }

        this.tr = atan2(mouseY - this.y * scale, mouseX - this.x * scale)

        this.updateBullets();
        super.update(); // Tank.update() function
        
        /*socket.emit('update_player', { // maybe change this to emit('update_player', this); ?
            'x': this.x,
            'y': this.y,
            'r': this.r,
            'v': this.v,
            'tr': this.tr,
            'name': this.name,
            'c': this.c,
        });*/

        socket.emit('update_player', this); // this works apearantly?
        // console.log(this);

    }

    updateBullets(){
        // Loop through already existing bullets
        for (const [bulletID, bullet] of Object.entries(this.bullets)){
            if(bullet.needsCleanup === true){
                delete this.bullets[bulletID];
            }
        }
    }

    drawName() {
        textAlign(CENTER);
        fill(colors[this.c]);
        text(this.name + " (You)", this.x * scale,(this.y - nameOffset) * scale);
    }

    fire() { // nts look at with and height
        this.bullets[floor(Math.random() * 10000000)] = new Bullet(
            this.x + (barrelLength - barrelOffSet) * cos(this.tr), 
            this.y + (barrelLength - barrelOffSet) * sin(this.tr), 
            this.tr,
        );
    }
}

class Enemy extends Tank {
    update() {
        if (currentState.players[this.id]) {
            this.x = currentState.players[this.id]['x'];
            this.y = currentState.players[this.id]['y'];
            this.r = currentState.players[this.id]['r'];
            this.v = currentState.players[this.id]['v'];
            this.tr = currentState.players[this.id]['tr'];
            this.c = currentState.players[this.id]['c'];
            this.name = currentState.players[this.id]['name'];
            this.hp = currentState.players[this.id]['hp'];
            this.updateBullets(currentState.players[this.id]['bullets']);
            super.update();
            console.log(this.bullets)
        }
    }

    updateBullets(bulletsUpdate){
        if(bulletsUpdate === undefined){return;}
        // Loop through new bullets
        for (const [bulletID, bulletState] of Object.entries(bulletsUpdate)){
            if(!(bulletID in this.bullets)){
                // Create new bullet.
                this.bullets[bulletID] = new Bullet(bulletState['x'], bulletState['y'], bulletState['r'])
            }
        }
        // Loop through already existing bullets
        for (const [bulletID, bullet] of Object.entries(this.bullets)){
            if(bullet.needsCleanup === true){
                delete this.bullets[bulletID];
            }
        }
    }

    drawName() {
        textAlign(CENTER);
        fill(colors[this.c]);
        text(this.name, this.x * scale,(this.y - nameOffset) * scale);
    }
}