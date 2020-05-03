// class maken collision rect

class Level {
    constructor(data) {
        this.backgroundImage = data.backgroundImage;
        this.gameRules = data.gameRules;
        this.title = data.title;
        this.timeLeft = roundTime;
        
        // this.environment = {};
        // Collider.types.forEach((t) => {
        //     this.environment[t] = []; // initialize all environment arrays
        // });

        tree = new GridCell(referenceWidth/2, referenceHeight/2, referenceWidth/2, referenceHeight/2);
        tree.init(treeDepth);

        // for (let key in data.environment) { // load in all colliders and environment stuff
        //     data.environment[key].forEach(c => {
        //         // this.environment[key].push(new Collider(c));
        //         tree.insert(new Collider(c));
        //     })
        // }
        console.log(data);
        data.environment.forEach(e => {
            tree.insert(new Collider(e));
        });

    }
    
    drawEnvironment() {
        tree.query(referenceWidth/2,referenceHeight/2,referenceWidth/2,referenceHeight/2,[]).forEach(c => {
        // tree.query(player.x, player.y, 100, 100,[]).forEach(c => {
            c.quickDraw();
        });
    }
}

class GridCell {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.drawGrid = true;
        this.drawMembers = false;

        this.capacity = 4;
        this.members = [];
        this.devided = false
    }

    init(level) {
        if (level === 0) {
            return;
        } else {
            this.devide();
            this.northEast.init(level-1);
            this.northWest.init(level-1);
            this.southEast.init(level-1);
            this.southWest.init(level-1);
        }
    }

    devide() {
        this.devided = true;
        this.northEast = new GridCell(this.x + this.w/2, this.y - this.h/2, this.w/2, this.h/2);
        this.northWest = new GridCell(this.x - this.w/2, this.y - this.h/2, this.w/2, this.h/2);
        this.southEast = new GridCell(this.x + this.w/2, this.y + this.h/2, this.w/2, this.h/2);
        this.southWest = new GridCell(this.x - this.w/2, this.y + this.h/2, this.w/2, this.h/2);
    }

    insert(collider) {
        if (collider.collideWithRect(this.x, this.y, this.w, this.h)) { // collider is inside this gridcell
            if (this.devided) { // if there are deeper levels
                this.northEast.insert(collider);
                this.northWest.insert(collider);
                this.southEast.insert(collider);
                this.southWest.insert(collider);    
            } else {
                this.members.push(collider);
            }
        }
    
        // if (collider.collideWithRect(this.x, this.y, this.w, this.h)) { // collider is inside this gridcell
        //     if (!this.devided) { // there are no deeper levels
        //         if (this.members.length < this.capacity) { // there is room for this collider
        //             this.members.push(collider);
        //             return; // no need to do anything more
        //         } else { // no room, so devide!
        //             this.devide();
        //         }
        //     } //else { // there deeper levels
        //     this.northEast.insert(collider);
        //     this.northWest.insert(collider);
        //     this.southEast.insert(collider);
        //     this.southWest.insert(collider);
        //     //}
        // }
    }

    query(x, y, w, h, array) {
        if (!( // does this work?
            this.x + this.w < x - w ||
            this.x - this.w > x + w ||
            this.y + this.h < y - h ||
            this.y - this.h > y + h 
        )) { // als range van toepassing is
            if (this.devided) { // nog niet de diepste laag
                return array.concat(
                        this.northEast.query(x,y,w,h,array),
                        this.northWest.query(x,y,w,h,array),
                        this.southEast.query(x,y,w,h,array),
                        this.southWest.query(x,y,w,h,array),
                        this.members
                    );
            } else { // dit is de diepste laag;
                // console.log(this.members);
                return array.concat(this.members);
            }
        } else {
            return [];
        }
    }

    draw() {
        
        rectMode(CENTER);
        stroke(255);
        noFill();
        rect(this.x*scale,this.y*scale,this.w*2*scale,this.h*2*scale);
        if (this.drawMembers) {
            this.members.forEach(m => {
                m.draw();
            })
        }
        if (this.devided && this.drawGrid) {
            this.northEast.draw();
            this.northWest.draw();
            this.southEast.draw();
            this.southWest.draw();
        }
    }
}

class Track {
    constructor(firstX,firstY,firstR) {
        this.points = [{'x':firstX,'y':firstY,'r':firstR, 'd': false, 'l': trackLifeSpan}];
    }

    draw() {
        this.points.forEach((p,i,a) => {
            
            if (p.d && i < a.length-1) {
                push();
                let life = p.l/trackLifeSpan/trackFadingPoint;
                trackColor.setAlpha(cap(life, 0, 1)*255);
                // trackColor.setAlpha((life>trackFadingPoint) ? 255 : 255*life);
                fill(trackColor);
                noStroke();
                translate(p.x*scale,p.y*scale);
                rotate(p.r);
                rect(0, 0, trackWidth*scale, trackHeight*scale);
                pop();
            }
            p.l--;
            if (p.l < 0) {
                //remove point
                this.points.splice(i,1);
            }
        });
    }

    addPoint(x,y,r,d) {
        let pl = this.points.length;
        let np = {'x':x,'y':y,'r':r, 'd':d, 'l': trackLifeSpan};
        
        if (pl < 3) {
            this.points.push(np);
        } else if (dist(this.points[pl-2].x, this.points[pl-2].y, np.x, np.y) < maxTrackSegmentLength) {
            // not long enough to be a new point
            this.points[pl-1] = np;
        } else {
            this.points.push(np);
        }
    }
}

class Collider {
    constructor(o) {
        if (new.target === Collider) { // if not sure what shape to make
            let c = {};
            c.type = o.type;

            if (o.shape === "circle") {
                c.shape = "circle";
                if (o.r) { // lelijk dit
                    c.x = o.x;
                    c.y = o.y;
                    c.r = o.r;
                } else {
                    c.x = o.x1;
                    c.y = o.y1;
                    c.r = dist(o.x1, o.y1, o.x2, o.y2)
                }
                return new ColliderCircle(c);
            }
            
            if (o.shape === "rect") {
                c.shape = "rect";

                if (o.x1 < o.x2) {
                    c.x1 = o.x1;
                    c.x2 = o.x2;
                } else {
                    c.x1 = o.x2;
                    c.x2 = o.x1;
                }

                if (o.y1<o.y2) {
                    c.y1 = o.y1;
                    c.y2 = o.y2;
                } else {
                    c.y1 = o.y2;
                    c.y2 = o.y1;
                }
                return new ColliderRect(c);
            }

            if (o.shape === "brush") {
                c.shape = "circle";
                c.x = o.x2,
                c.y = o.y2,
                c.r = Collider.brushSize;
                return new ColliderCircle(c);
            }

            if (o.shape === "line") {
                c.shape = "line";
                c.x1 = o.x1;
                c.y1 = o.y1;
                c.x2 = o.x2;
                c.y2 = o.y2;
                c.len = dist(o.x1, o.y1, o.x2, o.y2);
                return new ColliderLine(c);
            }
        } else { // if shape has been decided yet    
            for (let key in o) {
                this[key] = o[key];
            }
        }
    }

    static shapes = ['rect', 'circle', 'brush', 'line'];
    static types = ['grass', 'snow', 'colliders'];
    static brushSize = 5;

    quickDraw() {
        this.draw();
    }

    draw() {
        console.log('Collider.draw has been called!');
        // console.log(this)
    }
}

class ColliderCircle extends Collider {
    // constructor(c) {
    //     super(c);
    //     for (key in c) {
    //         this[key] = c[key];
    //     }
    //     console.log(c);
    //     this.x = c.x1;
    //     this.y = c.y1;
    //     this.r = dist(this.x1,this.y1,this.x2,this.y2);
    // }
    draw() {
        push();
        fill(environmentColors[this.type]);
        ellipse(this.x*scale,this.y*scale,2*this.r*scale);
        pop();
    }

    collideWithPoint(x,y) {
        return dist(this.x, this.y, x, y)<this.r;
    }

    collideWithTank(tankVerticis, tankCenter){
        let tankR = dist(tankCenter.x, tankCenter.y, tankVerticis[0].x, tankVerticis[0].y);
        if (dist(tankCenter.x, tankCenter.y, this.x, this.y) < this.r + tankR) { // collision!
            let dx = tankCenter.x - this.x;
            let dy = tankCenter.y - this.y;

            let factor = (this.r + tankR)/dist(tankCenter.x, tankCenter.y, this.x, this.y); // geheel/deel
            return {'x': this.x + dx*factor,'y': this.y + dy*factor}
        }
        return false;

        /*let newPos = tankCenter;
        let CHANGED = false;
        // go through each of the vertices in the list
        // for (let current=0; current<tankVerticis.length; current++) {
        for (let current=0; current<tankVerticis.length; current++) {
            let cv = tankVerticis[current];
            // if the corner collides with the circle, push the vertex out
            if (this.collideWithPoint(cv.x, cv.y)) {
                let cp = this.collissionPoint(cv.x, cv.y);
                let dx =  cp.x - cv.x;
                let dy =  cp.y - cv.y;
                // return {'x': tankCenter.x - dx, 'y': tankCenter.y - dy};
                newPos.x = tankCenter.x + dx;
                newPos.y = tankCenter.y + dy;
                CHANGED = true;
            }
        }
        if (CHANGED) {
            return newPos;
        }
        return false;*/
    }

    collideWithRect(x,y,w,h) { // does this work?
        return !(
            this.x + this.r < x - w ||
            this.x - this.r > x + w ||
            this.y + this.r < y - h ||
            this.y - this.r > y + h 
        );
    }
}

class ColliderRect extends Collider {
    draw() {
        push();
        rectMode(CORNERS);
        fill(environmentColors[this.type]);
        rect(this.x1*scale,this.y1*scale,this.x2*scale,this.y2*scale);
        pop();
    }

    collideWithPoint(x,y) {
        return (x>this.x1 && this.x2>x && y>this.y1 && this.y2>y);
    }

    collideWithTank(tankVerticis, tankCenter){
        // lu | mu | ru
        // lm | mm | rm
        // ld | md | rd
        
        let factor, dx, dy;
        let position = "";
        let tankR = dist(tankCenter.x, tankCenter.y, tankVerticis[0].x, tankVerticis[0].y);

        if (tankCenter.x < this.x1) {
            position += "l";
        } else if (tankCenter.x > this.x2) {
            position += "r"
        } else {
            position += "m"
        }

        if (tankCenter.y < this.y1) {
            position += "u";
        } else if (tankCenter.y > this.y2) {
            position += "d"
        } else {
            position += "m"
        }

        switch (position) {
            case "lu":
                factor = tankR/dist(tankCenter.x, tankCenter.y, this.x1, this.y1); // geheel/deel
                if (factor < 1) {return false;} // no collision
                dx = tankCenter.x - this.x1;
                dy = tankCenter.y - this.y1;
                return{x:this.x1 + dx*factor, y: this.y1 + dy*factor}
            case "ru":
                factor = tankR/dist(tankCenter.x, tankCenter.y, this.x2, this.y1);
                if (factor < 1) {return false;} // no collision
                dx = tankCenter.x - this.x2;
                dy = tankCenter.y - this.y1;
                return{x:this.x2 + dx*factor, y: this.y1 + dy*factor}
            case "rd":
                factor = tankR/dist(tankCenter.x, tankCenter.y, this.x2, this.y2);
                if (factor < 1) {return false;} // no collision
                dx = tankCenter.x - this.x2;
                dy = tankCenter.y - this.y2;
                return{x:this.x2 + dx*factor, y: this.y2 + dy*factor}
            case "ld":
                factor = tankR/dist(tankCenter.x, tankCenter.y, this.x1, this.y2);
                if (factor < 1) {return false;} // no collision
                dx = tankCenter.x - this.x1;
                dy = tankCenter.y - this.y2;
                return{x:this.x1 + dx*factor, y: this.y2 + dy*factor}
            case "mu":
                if (tankCenter.y < this.y1 - tankR) {return false;} // no collision
                return {x: tankCenter.x, y: this.y1 - tankR}
            case "rm":
                if (tankCenter.x > this.x2 + tankR) {return false;} // no collision
                return {x: this.x2 + tankR, y: tankCenter.y}
            case "md":
                if (tankCenter.y > this.y2 + tankR) {return false;} // no collision
                return {x: tankCenter.x, y: this.y2 + tankR}
            case "lm":
                if (tankCenter.x < this.x1 - tankR) {return false;} // no collision
                return {x: this.x1 - tankR, y: tankCenter.y}
            case "mm":
                console.log("mm");
                return false;
            default:
                console.log("this isn't supposed to be possible error code 911");
                return false
        }

        /*let next = 0;
        for (let current=0; current<tankVerticis.length; current++) {
            // get next vertex in list if we've hit the end, wrap around to 0
            next = current+1;
            if (next == tankVerticis.length) {
                next = 0;
            }
          
            let vc = tankVerticis[current];
            let vn = tankVerticis[next];
          
            let collision = collideLineRect(vc.x,vc.y,vn.x,vn.y, this.x1,this.y1,this.x2-this.x1,this.y2-this.y1);
            if (collision) {
                // Which vector should handle newpos for which collision?
                let orderedVectors = {'bottom' : vc, 'right' : vc, 'left' : vc, 'top' : vc}
                for (let current=0; current<tankVerticis.length; current++) {
                    let vect = tankVerticis[current];
                    if(!this.collideWithPoint(vect.x, vect.y)){
                        continue;
                    }
                    if(vect['x'] > orderedVectors.left.x){
                        orderedVectors.left = vect;
                    }
                    if(vect['x'] < orderedVectors.right.x){
                        orderedVectors.right = vect;
                    }
                    if(vect['y'] > orderedVectors.top.y){
                        orderedVectors.top = vect;
                    }
                    if(vect['y'] < orderedVectors.bottom.y){
                        orderedVectors.bottom = vect;
                    }
                }

                // calc intersection  
                collision = collideLineRect(vc.x,vc.y,vn.x,vn.y, this.x1,this.y1,this.x2-this.x1,this.y2-this.y1, true);
                let newPos = {'x': tankCenter.x, 'y': tankCenter.y}
                if(collision.left.x){
                    newPos['x'] = newPos['x'] - (orderedVectors.left.x - collision.left.x);
                }
                if(collision.right.x){
                    newPos['x'] = newPos['x'] + (collision.right.x - orderedVectors.right.x);
                }
                if(collision.top.y){
                    newPos['y'] = newPos['y'] - (orderedVectors.top.y - collision.top.y);
                }
                if(collision.bottom.y){
                    newPos['y'] = newPos['y'] + (collision.bottom.y - orderedVectors.bottom.y);
                }
                return newPos;
            }
            
        }
        
        return false;*/
    }

    collissionPoint(x,y) {
        let newPos = {'x': x, 'y': y};
        let minD = min(x-this.x1,y-this.y1, this.x2-x,this.y2-y);
        if (minD == x-this.x1) {// left
            newPos.x = this.x1;
        }
        if (minD == y-this.y1) {// up
            newPos.y = this.y1;
        }
        if (minD == this.x2-x) {// right
            newPos.x = this.x2;
        }
        if (minD == this.y2-y) { // down
            newPos.y = this.y2;
        }  
        return newPos;
    }

    collideWithRect(x, y, w, h) { // does this work?
        return !(
            this.x1 > x + w ||
            this.x2 < x - w ||
            this.y1 > y + h ||
            this.y2 < y - h
        );
    }
}

class ColliderLine extends Collider {
    draw() {
        line(this.x1*scale, this.y1*scale, this.x2*scale, this.y2*scale);
    }

    closestPoint(x,y) {
        let t = cap(((x - this.x1) * (this.x2 - this.x1) + (y - this.y1) * (this.y2 - this.y1)) / this.len**2,0,1);
        let projectionX = this.x1 + t*(this.x2-this.x1);
        let projectionY = this.y1 + t*(this.y2-this.y1);
        return {x:projectionX,y:projectionY}
    }

    collideWithPoint(x,y) {
        return (collidePointLine(x,y,this.x1,this.y1,this.x2,this.y2));
    }

    collideWithTank(tankVerticis, tankCenter) {
        let tankR = dist(tankCenter.x, tankCenter.y, tankVerticis[0].x, tankVerticis[0].y);
        let cp = this.closestPoint(tankCenter.x,tankCenter.y);
        let ds = dist(tankCenter.x,tankCenter.y,cp.x,cp.y); // delta spatium
        if (ds>tankR){return false} // no collision
        let factor = tankR/ds;
        return {x:cp.x + factor*(tankCenter.x-cp.x),y:cp.y + factor*(tankCenter.y-cp.y)}
    }

    collideWithRect(x,y,w,h) {
        return collideLineRect(this.x1,this.y1,this.x2,this.y2,x-w,y-h,2*w,2*h, false) || collidePointRect(this.x1,this.y1, x-w,y-h,x+w,y+h) || collidePointRect(this.x2,this.y2, x-w,y-h,x+w,y+h)
    }
}

class Bullet {
    constructor(x, y, r, v, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.dmg = bulletDamage;
        this.r = r;
        this.needsCleanup = false;
        this.isPlayerBullet = isPlayerBullet;
        sounds.shot.play();
    }

    updateInternals(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    checkCollisions(){
        let colCheck = (enemy) => {
            let enemyTankVerticis = enemy.getVerticis();
            // let o = {'x': enemy.x, 'y': enemy.y}
            let o = enemy.getPos();
            // enemyTankVerticis[0] = rotatePointPoint({'x': o.x - tankWidth/2, 'y':o.y - tankLength/2}, o, enemy.r)
            // enemyTankVerticis[1] = rotatePointPoint({'x': o.x - tankWidth/2, 'y':o.y + tankLength/2}, o, enemy.r)
            // enemyTankVerticis[2] = rotatePointPoint({'x': o.x + tankWidth/2, 'y':o.y - tankLength/2}, o, enemy.r)
            // enemyTankVerticis[3] = rotatePointPoint({'x': o.x + tankWidth/2, 'y':o.y + tankLength/2}, o, enemy.r)
            // DEBUG hitbox
            push();
            stroke(colors['white'])
            point(enemyTankVerticis[0].x * scale, enemyTankVerticis[0].y * scale);
            point(enemyTankVerticis[1].x * scale, enemyTankVerticis[1].y * scale);
            point(enemyTankVerticis[2].x * scale, enemyTankVerticis[2].y * scale);
            point(enemyTankVerticis[3].x * scale, enemyTankVerticis[3].y * scale);
            pop();

            let py = this.y;
            let px = this.x;
            let collision = false;
            let next = 0;
            for (let current=0; current<enemyTankVerticis.length; current++) {
                next = current+1;
                if (next == enemyTankVerticis.length){next = 0;}
                let vc = enemyTankVerticis[current];
                let vn = enemyTankVerticis[next];
                if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
                     (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
                        collision = !collision;
                }
            }

            return collision
        }

        enemies.forEach((enemy) => {
            if(colCheck(enemy)){
                console.log('hit!')
                this.needsCleanup = true;

                enemy.hp -= this.dmg;
                enemy.isHit = true;

                if(this.isPlayerBullet){
                    socket.emit('bullet_hit', {'hit': enemy.id});
                }
            }
        })

        if(colCheck(player)){
            // We got hit!
            player.hp -= this.dmg;
            // if (player.hp < 0) {
            //     console.log("killed by " + this.)
            // }
            player.isHit = true;
            this.needsCleanup = true;
        }
    }

    update() {
        this.checkCollisions();

        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;

        if(this.x !== cap(this.x, 0, referenceWidth) || this.y !== cap(this.y, 0, referenceHeight)){
            this.needsCleanup = true;
        }
        tree.query(this.x,this.y,10,10,[]).forEach(c => {
            if (c.type === "colliders") {
                if (c.collideWithPoint(this.x,this.y)) {
                    this.needsCleanup = true
                }
            }
        })
        // console.log(this);
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
        this.hp = startHp;
        this.name = c;
        this.c = c;
        this.score = 0;

        this.needsCleanup = false;
        this.isHit = false;
        this.lastHitBy;
        
        this.wasOnSurface = ["default","default","default","default"];
        this.onSurface = ["default","default","default","default"];
        this.collisionRad = tankCollisionRad;

        this.bullets = {};
        this.tracks = [new Track(this.x,this.y,this.r), new Track(this.x,this.y,this.r)];
        this.upgrades = {
            'superSpeed': 0,
            'machinegun': 0,
            'juggernaut': 0 
        };
    }

    getVerticis() {
        return [ 
            rotatePointPoint({'x': this.x - tankWidth/2, 'y':this.y - tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x + tankWidth/2, 'y':this.y - tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x + tankWidth/2, 'y':this.y + tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x - tankWidth/2, 'y':this.y + tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
        ];
    }

    getPos() {
        return {'x': this.x, 'y': this.y};
    }

    upgrade(upgrade) {
        switch(upgrade) {
            case 'superSpeed':
                this.upgrades.superSpeed = upgradeDuration;
                break;
            case 'machinegun':
                this.upgrades.machinegun = upgradeDuration;
                break;
            case 'juggernaut':
                this.upgrades.juggernaut = upgradeDuration;
                break;
            default:
                alert("something went very wrong, this is not supposed to happen! error code 420 lmao");
                break;
        }
    }

    draw() {
        let tankDrawColor;

        if(this.isHit){
            tankDrawColor = "white";
            this.isHit = false;
        }else{
            tankDrawColor = this.c;
        }

        push();
        translate(this.x * scale, this.y * scale);
        rotate(this.r);
        fill(colors[tankDrawColor]);
        rect(0, 0, tankLength * scale, tankWidth * scale);
        translate(barrelOffSet/2 * scale, 0);
        rotate(-this.r);
        rotate(this.tr);
        rectMode(CORNER);
        rect(-barrelOffSet/2 * scale, -barrelWidth/2 * scale, barrelLength * scale, barrelWidth * scale);
        pop();

        this.drawHp();
    };
    
    drawHp() {
        push();
        //rectMode(CORNER);
        noStroke();
        fill(hpBackgroundColor);
        rect(this.x * scale, (this.y - hpOffset) * scale, hpWidth * scale, hpHeight * scale);
        fill(hpColor);

        let hpw = cap((this.hp/startHp), 0, 100) * hpWidth
        rect(
            (this.x - (hpWidth - hpw)/2) * scale,
            (this.y - hpOffset) * scale, 
            hpw * scale,
            hpHeight * scale
        );
        pop()
    }

    update() {
        if(this.hp <= 0){
            this.destroy();
            //state.die();
            console.log('killed by ' + this.lastHitBy);
            socket.emit('kill', {'killer': this.lastHitBy});
        }

        this.onGrass = [0,0,0,0]; // nts wtf clean dit up!
        this.getVerticis().forEach((v, i) => {
            // level.environment.grass.forEach(g => {
            tree.query(this.x,this.y,this.collisionRad, this.collisionRad, []).forEach(g => {
                if ((g.type === "grass" || g.type === "snow") && g.collideWithPoint(v.x,v.y)) {
                    // this.onGrass = true
                    this.onGrass[i] = true
                }
            });
            // if (level.environment.snow) {
            //     level.environment.snow.forEach(s => {
            //         if (s.collideWithPoint(v.x,v.y)) {
            //             // this.onGrass = true
            //             this.onGrass[i] = true
            //         }
            //     });
            // }
        });

        let speedCap = maxV;
        if (this.upgrades.superSpeed) {
            speedCap = superMaxV;
            this.upgrades.superSpeed--;
        }
        this.v = cap(this.v,0,speedCap);
        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;
        this.x = cap(this.x,0,referenceWidth);
        this.y = cap(this.y,0,referenceHeight);
    }

    makeTracks() {
        for (let i = 1; i <3; i++) {            
            this.tracks[i-1].addPoint(this.getVerticis()[i].x,this.getVerticis()[i].y,this.r, this.onGrass[i]);
        }
    }

    drawTracks() {
        // console.time('drawTracks');
        this.tracks.forEach(t => {
            t.draw();
        });
        // console.timeLog('drawTracks');
        // console.timeEnd('drawTracks')
    }
    
    rotate(dr) {
        this.r += dr;
    }
    
    rotateTurret(dr){
        this.tr += dr;
    }
    
    drawBullets() {
        for (const [bulletID, bullet] of Object.entries(this.bullets)){
            bullet.update()
            push();
            point(bullet.x * scale, bullet.y * scale);
            translate(bullet.x*scale,bullet.y*scale);
            rotate(bullet.r);
            image(images.bullet, -bulletWidth/2*scale, -bulletLength/2*scale, bulletWidth*scale, bulletLength*scale);
            pop();
        }
    }

    destroy() {
        console.log("destroy!");
        io
        // bufferStates[0].pla
        // currentState.players[this.id].x = tankBeginX;
        // currentState.players[this.id].y = tankBeginY;
        // currentState.players[this.id].hp = startHp;
        // splosions.push(new Animation(animations.splosion, this.x, this.y))
        // this.v = 0;
        // this.x = tankBeginX;
        // this.y = tankBeginY;
        // this.hp = startHp;
    }
}

class Player extends Tank {
    update() {
        // if (state.is('game')) { // remove if controlls are still enabled during paused screen
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
        //} // remove id controls are still enabled during paused screen

        this.tr = atan2(mouseY - this.y * scale, mouseX - this.x * scale)

        super.update(); // Tank.update() function

        // --- collisions:
        let tankVerticis = this.getVerticis();
        // DEBUG hitbox
        push();
        stroke(colors['white'])
        point(tankVerticis[0].x * scale, tankVerticis[0].y * scale);
        point(tankVerticis[1].x * scale, tankVerticis[1].y * scale);
        point(tankVerticis[2].x * scale, tankVerticis[2].y * scale);
        point(tankVerticis[3].x * scale, tankVerticis[3].y * scale);
        pop();
        // level.environment.colliders.forEach(c => {
        tree.query(this.x,this.y,this.collisionRad, this.collisionRad, []).forEach(c => {
            if (c.type !== "colliders") { // nts improve
                return;
            }
            // if (c.collideWithPoint(this.x, this.y)) {
            //     let newPos = c.collissionPoint(this.x, this.y);
            //     this.x = newPos.x;
            //     this.y = newPos.y;
            // }
            let tankLevelCol = c.collideWithTank(tankVerticis, this.getPos());
            if (tankLevelCol){
                this.x = tankLevelCol.x;
                this.y = tankLevelCol.y;
            }
        });

        this.updateBullets();

        socket.emit('update_player', this); // this works apearantly?

        
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
        // let bulletVX, bulletVY;
        let tankVX = this.v*cos(this.r);
        let tankVY = this.v*sin(this.r);
        let bulletVX = bulletSpeed*cos(this.tr);
        // console.log(bulletVX);
        let bulletVY = bulletSpeed*sin(this.tr);
        let compensation = (bulletVX + tankVX)<0 ? PI : 0; // compensation for gayness of atan

        this.bullets[floor(Math.random() * 10000000)] = new Bullet(
            this.x + (barrelLength - barrelOffSet) * cos(this.tr), 
            this.y + (barrelLength - barrelOffSet) * sin(this.tr), 
            atan((bulletVY + tankVY)/(bulletVX+tankVX)) + compensation,
            bulletSpeed,
            true
        );
    }

    onReceivedHit(data){
        // console.log(data);
        this.lastHitBy = data.shotBy;
        sounds.boem.play();
    }

    destroy() {
        socket.emit('destroy', {'x':this.x,'y':this.y});
        
        this.v = 0;
        this.x = tankBeginX;
        this.y = tankBeginY;
        this.hp = startHp;
        
        // super.destroy();
        //state.respawn();
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
        }
    }

    updateBullets(bulletsUpdate){
        if(bulletsUpdate === undefined){return;}
        // Loop through new bullets
        for (const [bulletID, bulletState] of Object.entries(bulletsUpdate)){
            if(!(bulletID in this.bullets)){
                // Create new bullet.
                this.bullets[bulletID] = new Bullet(bulletState['x'], bulletState['y'], bulletState['r'], bulletState['v'], false)
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

class Sound {
    constructor(src) {
        this.i = 0;
        this.m = maxAudioDex;
        this.sounds = [];
        for (let i = 0; i < this.m; i++) {
            this.sounds[i] = new Audio(`src/audio/${src}.wav`);
        }
    }

    play() {
        this.sounds[this.i].play();
        this.i = (this.i+1)%this.m
    }
}

class Animation {
    constructor(a, x, y) {
        this.a = a.clone();
        // this.a.looping = false;
        this.a.frameDelay = 2;

        this.x = x;
        this.y = y;
        this.done = false;
    }

    playOnce() {
        if (!this.done && this.a.getFrame() !== this.a.images.length-1) {
            animation(this.a, this.x*scale, this.y*scale);
        } else {
            this.done = true;
        }
    }
}