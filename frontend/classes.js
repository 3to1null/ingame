// class maken collision rect

class Level {
    constructor(data) {
        this.backgroundImage = data.backgroundImage;
        this.gameRules = data.gameRules;
        this.environment = {'grass': [], 'colliders': []};
        data.environment.grass.forEach(g => {
            this.environment.grass.push(new ColliderRect(g.x1,g.y1,g.x2,g.y2));
        });
        data.environment.colliders.forEach(c => {
            if (c.r) {
                this.environment.colliders.push(new ColliderCircle(c.x,c.y,c.r));
            }
            if (c.x1) {
                this.environment.colliders.push(new ColliderRect(c.x1,c.y1,c.x2,c.y2));
            }
        });
    }

    drawGrass() {
        push();
        noStroke();
        fill(grassColor);
        rectMode(CORNERS);
        let patch;
        level.environment.grass.forEach(g => {
            rect(g.x1*scale,g.y1*scale,g.x2*scale,g.y2*scale);
        });
        rect(newCollider.x1*scale, newCollider.y1*scale, newCollider.x2*scale, newCollider.y2*scale);
        pop();
    }
    
    drawColliders() {
        push();
        noStroke();
        fill(colliderColor);
        this.environment.colliders.forEach(c => {
            c.draw();
        });
        rectMode(CORNERS);
        if (addCollider == "rect" && newCollider.x2) {
            rect(newCollider.x1*scale,newCollider.y1*scale,newCollider.x2*scale,newCollider.y2*scale);
        }
        if (addCollider == "circle" && newCollider.r) {
            ellipse(newCollider.x*scale, newCollider.y*scale, 2*newCollider.r*scale);
        }
        pop();
    }
}

class Collider {
    constructor() {
        
    }
}

class ColliderCircle {//extends Collider {
    constructor(x,y,r) {
        this.x = x,
        this.y = y,
        this.r = r
    }
    
    draw() {
        push();
        fill(colliderColor);
        ellipse(this.x*scale,this.y*scale,2*this.r*scale);
        pop();
    }

    collideWithPoint(x,y) {
        return dist(this.x, this.y, x, y)<this.r;
    }

    collideWithTank(tankVerticis, tankCenter){
        return false;
    }

    collissionPoint(x,y) {
        let factor = this.r/dist(this.x, this.y, x, y); 
        return {'x': this.x + (x-this.x)*factor, 'y': this.y + (y-this.y)*factor};
    }
}

class ColliderRect { //extends Collider {
    constructor(x1,y1,x2,y2) {
        this.x1 = x1,
        this.y1 = y1,
        this.x2 = x2,
        this.y2 = y2
    }

    draw() {
        push();
        rectMode(CORNERS);
        fill(colliderColor);
        rect(this.x1*scale,this.y1*scale,this.x2*scale,this.y2*scale);
        pop();
    }

    collideWithPoint(x,y) {
        return (x>this.x1 && this.x2>x && y>this.y1 && this.y2>y);
    }

    collideWithTank(tankVerticis, tankCenter){
        let next = 0;
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
        
        return false;
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
}

class Bullet {
    constructor(x, y, r, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.v = bulletSpeed;
        this.dmg = bulletDamage;
        this.r = r;
        this.needsCleanup = false;
        this.isPlayerBullet = isPlayerBullet;
    }

    updateInternals(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    checkCollisions(){
        let colCheck = (enemy) => {
            let enemyTankVerticis = [];
            let o = {'x': enemy.x, 'y': enemy.y}
            enemyTankVerticis[0] = rotatePointPoint({'x': o.x - tankWidth/2, 'y':o.y - tankLength/2}, o, enemy.r)
            enemyTankVerticis[1] = rotatePointPoint({'x': o.x - tankWidth/2, 'y':o.y + tankLength/2}, o, enemy.r)
            enemyTankVerticis[2] = rotatePointPoint({'x': o.x + tankWidth/2, 'y':o.y - tankLength/2}, o, enemy.r)
            enemyTankVerticis[3] = rotatePointPoint({'x': o.x + tankWidth/2, 'y':o.y + tankLength/2}, o, enemy.r)

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

        this.needsCleanup = false;
        this.isHit = false;

        this.bullets = {};
        this.upgrades = {
            'superSpeed': 0,
            'machinegun': 0,
            'juggernaut': 0 
        };
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
        }

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

    /*isInWall() {
        let p;
        for(p of level.environment.grass) {
            if (p.x1 < this.x && p.x2 > this.x && p.y1 < this.y && p.y2 > this.y) {
                //let facing = mod(this.r/PI*2+ 0.5,4); // 0-1 = right, 1-2 = down etc.
                let minD = min(this.x-p.x1,this.y-p.y1, p.x2-this.x,p.y2-this.y);
                switch (minD) {
                    case this.x-p.x1:
                        this.x = p.x1;
                        break;
                    case this.y-p.y1:
                        this.y = p.y1;
                        break;
                    case p.x2 - this.x:
                        this.x = p.x2;
                        break;
                    case p.y2 - this.y:
                        this.y = p.y2;
                        break;  
                    default:
                        alert("something went terribly wrong here, this isn't supposed to be possible. Error code 666 lmao");
                        break;
                }
                return true;
            } 
        }
        return false;
    }*/

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
            image(bulletSprite, -bulletWidth/2*scale, -bulletLength/2*scale, bulletWidth*scale, bulletLength*scale);
            pop();
        }
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

        super.update(); // Tank.update() function

        // --- collisions:
        let tankVerticis = [
            rotatePointPoint({'x': this.x - tankWidth/2, 'y':this.y - tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x + tankWidth/2, 'y':this.y - tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x + tankWidth/2, 'y':this.y + tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
            rotatePointPoint({'x': this.x - tankWidth/2, 'y':this.y + tankLength/2}, {'x': this.x, 'y': this.y}, this.r),
        ]
        // DEBUG hitbox
        push();
        stroke(colors['white'])
        point(tankVerticis[0].x * scale, tankVerticis[0].y * scale);
        point(tankVerticis[1].x * scale, tankVerticis[1].y * scale);
        point(tankVerticis[2].x * scale, tankVerticis[2].y * scale);
        point(tankVerticis[3].x * scale, tankVerticis[3].y * scale);
        pop();
        level.environment.colliders.forEach(c => {
            // if (c.collideWithPoint(this.x, this.y)) {
            //     let newPos = c.collissionPoint(this.x, this.y);
            //     this.x = newPos.x;
            //     this.y = newPos.y;
            // }
            let tankLevelCol = c.collideWithTank(tankVerticis, {'x': this.x, 'y': this.y});
            
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
        this.bullets[floor(Math.random() * 10000000)] = new Bullet(
            this.x + (barrelLength - barrelOffSet) * cos(this.tr), 
            this.y + (barrelLength - barrelOffSet) * sin(this.tr), 
            this.tr,
            true
        );
    }

    onReceivedHit(){
        console.log('Got hit!')
    }

    destroy(){
        // Needs fancy animation
        if(gameState !== 3){
            gameState = 3;
            location.reload();
        }
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
                this.bullets[bulletID] = new Bullet(bulletState['x'], bulletState['y'], bulletState['r'], false)
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

    destroy(){
        // Needs fancy animation
    }
}