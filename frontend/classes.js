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
        drawTank(this.x, this.y, this.r, this.c, this.tr);
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
}

class Player extends Tank {
    update() {
        if (inputs.left){
            this.rotate(-rotIncrease);
        }
        if (inputs.right){
            this.rotate(rotIncrease);
        }
        if (inputs.up){
            this.v += acceleration;
        }
        if (inputs.down){
            this.v -= acceleration;
        }

        this.tr = atan2(mouseY - this.y, mouseX - this.x)
        
        super.update(); // Tank.update() function

        socket.emit('update_player', {
            'x': this.x,
            'y': this.y,
            'r': this.r,
            'v': this.v
        });
    }
}

class Enemy extends Tank {
    update() {
        if (currentState.players[this.id]) {
            this.x = currentState.players[this.id]['x'];
            this.y = currentState.players[this.id]['y'];
            this.r = currentState.players[this.id]['r'];
            this.v = currentState.players[this.id]['v'];

            super.update();
        }
    }
}