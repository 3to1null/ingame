class Bullet {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.v = bulletSpeed;
        this.r = r;
    }

    update() {
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;
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

        this.bullets = [];
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.r);
        fill(colors[this.c]);
        rect(0, 0, tankLength, tankWidth);
        translate(barrelOffSet/2, 0);
        rotate(-this.r);
        rotate(this.tr);
        rectMode(CORNER);
        rect(-barrelOffSet/2, -barrelWidth/2, barrelLength, barrelWidth);
        pop();
    };
    
    drawHp() {
        fill(hpBackgroundcolor);
        rect(this.x, this.y, hpWidth, hpHeight);
    }

    update() {
        this.v = cap(this.v,0,maxV);
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;
        this.x = cap(this.x,0,width);
        this.y = cap(this.y,0,height);
    }

    rotate(dr) {
        this.r += dr;
    }

    rotateTurret(dr){
        this.tr += dr;
    }

    fire() {
        this.bullets.push(new Bullet(this.x + (barrelLength - barrelOffSet) * cos(this.tr), this.y + (barrelLength - barrelOffSet) * sin(this.tr), this.tr));
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

        this.tr = atan2(mouseY - this.y, mouseX - this.x)
        
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

    }

    drawName() {
        textAlign(CENTER);
        fill(colors[this.c]);
        text(this.name + " (You)", this.x,this.y - nameOffset);
    }

    drawBullets() {
        stroke(colors[this.c]);   
        point(this.x, this.y); 
        for(let i = this.bullets.length -1; i >= 0; i--) {
            let b = this.bullets[i];
            b.update();
            point(b.x, b.y);
        }
        stroke(colors.black);
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
            this.bullets = currentState.players[this.id]['bullets'];

            super.update();
        }
    }

    drawName() {
        textAlign(CENTER);
        fill(colors[this.c]);
        text(this.name, this.x,this.y - nameOffset);
    }

    drawBullets() {
        stroke(colors[this.c]);   
        point(this.x, this.y); 
        for(let i = this.bullets.length -1; i >= 0; i--) {
            let b = this.bullets[i];
            // updating position
            b.x += cos(b.r)*b.v;
            b.y += sin(b.r)*b.v;

            point(b.x, b.y);
        }
        stroke(colors.black);
    }
}