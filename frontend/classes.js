class Bullet {
    constructor(x, y, r, c) {
        this.c = c;
        this.x = x;
        this.y = y;
        this.v = bulletSpeed;
        this.r = r;
    }
    draw() {
        stroke(colors[this.c]);
        point(this.x, this.y);
        stroke(color(0,0,0));
    };

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

        this.c = c;
    }

    draw() {
        //drawTank(this.x, this.y, this.r, this.c, this.tr);
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

    update() {
        this.v = cap(this.v, 0, maxV);
        
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;
        
        this.x = cap(this.x, 0, width);
        this.y = cap(this.y, 0, height);
    }

    rotate(dr) {
        this.r += dr;
    }

    rotateTurret(dr){
        this.tr += dr;
    }

    fire() {
        bullets.push(new Bullet(this.x + (barrelLength - barrelOffSet) * cos(this.tr), this.y + (barrelLength - barrelOffSet) * sin(this.tr), this.tr, this.c));
    }
}

class Player extends Tank {
    update() {
        if (keyIsDown(controlls.left)){
            this.rotate(-rotIncrease);
        }
        if (keyIsDown(controlls.right)){
            this.rotate(rotIncrease);
        }
        if (keyIsDown(controlls.up)){
            this.v += acceleration;
        }
        if (keyIsDown(controlls.down)){
            this.v -= acceleration;
        }

        this.tr = atan2(mouseY - this.y, mouseX - this.x)
        
        super.update(); // Tank.update() function

        socket.emit('update_player', {
            'x': this.x,
            'y': this.y,
            'r': this.r,
            'v': this.v,
            'tr': this.tr,
            'c': this.c,
        });
    }

    drawName() {
        textAlign(CENTER);
        fill(nameColor);
        text("You", this.x,this.y - nameOffset);
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
            this.c = currentState.players[this.id]['c']

            super.update();
        }
    }

    drawName() {
        textAlign(CENTER);
        fill(nameColor);
        text(names[this.c], this.x,this.y - nameOffset);
    }
}