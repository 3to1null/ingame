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
            rect(0, 0, tankLength, tankWidth);
            rect(barrelOffSet,0,barrelOffSet + barrelLength,barrelWidth);
            rotate(-this.r);
            translate(-this.x, -this.y);
        };

        this.update = function() {
            if (inputs[0])
                this.rotate(-rotIncrease);
            if (inputs[1])
                this.rotate(rotIncrease);
            if (inputs[2])
                this.v += acceleration;
            if (inputs[3])
                this.v -= acceleration;

            this.v = cap(this.v, 0, maxV);
            
            this.x += cos(this.r)*this.v;
            this.y += sin(this.r)*this.v;
            
            this.x = cap(this.x, 0, width);
            this.y = cap(this.y, 0, height);

            socket.emit('update_player', {
                'x': this.x,
                'y': this.y,
                'r': this.r,
                'v': this.v
            }
  )


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
            if (currentState.players[this.id]) {
                this.x = currentState.players[this.id]['x'];
                this.y = currentState.players[this.id]['y'];
                this.r = currentState.players[this.id]['r'];
                this.v = currentState.players[this.id]['v'];

                this.v = cap(this.v, 0, maxV);
                
                this.x += cos(this.r)*this.v;
                this.y += sin(this.r)*this.v;
                
                this.x = cap(this.x, 0, width);
                this.y = cap(this.y, 0, height);
            }
        };

        this.rotate = function(dr) {
            this.r += dr;
        };
    }
}