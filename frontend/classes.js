class Level {
    constructor(data) {
        this.backgroundImage = data.bgi;
        this.gameRules = data.gameRules;
        this.environment = data.environment;
    }

    drawGrass() {
        push();
        noStroke();
        fill(grassColor);
        rectMode(CORNERS);
        let patch;
        for(patch of this.environment.grass) {
            //console.log(patch);
            rect(patch.x1*scale,patch.y1*scale,patch.x2*scale,patch.y2*scale);
        }
        rect(newPatch.x1*scale, newPatch.y1*scale, newPatch.x2*scale, newPatch.y2*scale);
        pop();
    }

}

class Bullet {
    constructor(x, y, r, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.v = bulletSpeed;
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
                // If we shot this bullet, broadcast the hit.
                if(this.isPlayerBullet){
                    socket.emit('bullet_hit', {'hit': enemy.id});
                }
            }
        })

        if(colCheck(player)){
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU')
            this.needsCleanup = true;
        }
    }

    update() {
        this.checkCollisions();

        this.x += cos(this.r)*this.v;
        this.y += sin(this.r)*this.v;

        if(this.x !== cap(this.x, 0, referenceWidth) || this.y !== cap(this.y, 0, referenceHeight)){
            this.needsCleanup = true; // hahahahaha o wacht, dit is serieus? HAHAHAHHAHAHAHAHAHA
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
        this.drawHp();
    };
    
    drawHp() {
        push();
        //rectMode(CORNER);
        noStroke();
        fill(hpBackgroundColor);
        rect(this.x * scale, (this.y - hpOffset) * scale, hpWidth * scale, hpHeight * scale);
        fill(hpColor);
        rect(this.x * scale, (this.y - hpOffset) * scale, (this.hp/startHp)*hpWidth*scale, hpHeight*scale);
        pop()
    }

    update() {
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

    rotate(dr) {
        this.r += dr;
    }

    rotateTurret(dr){
        this.tr += dr;
    }

    drawBullets() { // nts push and pop
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
            true
        );
    }

    onReceivedHit(){
        console.log('Got hit!')
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
}