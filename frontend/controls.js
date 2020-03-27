// --- controls for things
let leftKey = 65;
let rightKey = 68;
let upKey = 87;
let downKey = 83;
let fireKey;

let controlText;

let WAITINGONINPUT = false;

let controls = {
    'changing': 0, // none, left, right, up, down, fire
    'left': leftKey,
    'right': rightKey,
    'up': upKey,
    'down': downKey,
    'fireWithMouse': true,
    'fire': fireKey,
    'addCircleCollider': 67, // c
    'addRectCollider': 82, // r
    'exportLevel': 69, // LMAO // e 
    'addGrassPatch': 71 // g
    //'escapeCollider': ESCAPE
}


function changeControls() {
    if (!controls.changing) {
        controls.changing = 1;
        controlText = "listening for left input..."
        controlTextOffset = 3*buttonMargin;
    }
}

function changeFire () {
    /*document.getElementById("fireWithMouse").blur();
    if (document.getElementById("fireWithMouse").checked) {
        controls.fireWithMouse = true;
    } else {
        controls.fireWithMouse = false;
    }*/

    if (this.checked()) {
        console.log('Checking!');
      } else {
        console.log('Unchecking!');
      }

    //controls.fireWithMouse = !controls.fireWithMouse;
    //changeControls();
}

function keyPressed() {
    //#region changing controls DIT IS HECKA LELIJK
    //let textBox = document.getElementById("controls");
    if (controls.changing && keyCode == ESCAPE) {
        controls.changing = 0;
        controlText = "";
        controlTextOffset = 0;
    }

    if(keyCode == controls.addCircleCollider) {
        addCollider = "circle";
    }
    if (keyCode == controls.addRectCollider) {
        addCollider = "rect";
    }
    if (keyCode === ESCAPE) {
        addCollider = "none";
        newCollider = {};
    }
    if (keyCode == controls.exportLevel) {
        console.log(JSON.stringify(level.environment));
    }
    if (keyCode == controls.addGrassPatch) {
        addCollider = "grass"
    }
    switch(controls.changing) {
        case 0: // the controls dont need changing
            if (keyCode == controls.fire) {
                player.fire();
            }
            break;
        case 1: // the left needs changing
            controls.left = keyCode;
            controlText = "listening for right input...";
            controls.changing++;
            break;
        case 2: // the right needs changing
            controls.right = keyCode;
            controlText = "listening for up input...";
            controls.changing++;
            break;
        case 3: // the up needs changing
            controls.up = keyCode;
            controlText = "listening for down input...";
            controls.changing++;
            break;
        case 4: // the down needs changing
            controls.down = keyCode;
            if (controls.fireWithMouse) { // end configuration early
                controlText = "";
                controlTextOffset = 0;
                //textBox.style.visibility = "invisible";
                controls.changing = 0;
            } else {
                controlText = "listening for fire input...";
                controls.changing++;
            }
            break;
        case 5: // the fire needs changing
            controls.fire = keyCode;
            controlText = "";
            controlTextOffset = 0;
            //textBox.style.visibility = "invisible";
            controls.changing = 0;
            break;
        default:
            alert("something went very wrong, this is not supposed to happen! error code 69 lmao");
            break;
    }
    //#endregion
}


function mousePressed() {
    if (addCollider == "rect" ) {
        if (!newCollider.x1) {
            newCollider = {'x1': mouseX/scale, 'y1': mouseY/scale, 'x2': mouseX/scale, 'y2': mouseY/scale}  
        } else {
            level.environment.colliders.push(new ColliderRect(newCollider.x1,newCollider.y1,newCollider.x2,newCollider.y2));
            newCollider = {};
        }
    }
    
    if (addCollider == "circle") {
        if (!newCollider.x) {
            newCollider = {'x': mouseX/scale, 'y': mouseY/scale, 'r': 0};
        } else {
            level.environment.colliders.push(new ColliderCircle(newCollider.x,newCollider.y,newCollider.r));
            newCollider = {};
        } 
    }
    
    if (addCollider == "grass") {
        if (!newCollider.x1) {
            newCollider = {'x1': mouseX/scale, 'y1': mouseY/scale, 'x2': mouseX/scale, 'y2': mouseY/scale}  
        } else {
            level.environment.grass.push(new ColliderRect(newCollider.x1,newCollider.y1,newCollider.x2,newCollider.y2));
            newCollider = {};
        }
    }

    if (mouseY < 30 && mouseX <30) { // nts fricking lelijk
        gameState = 2;
        addCollider = "none";
        newCollider = {};
    } else if (controls.fireWithMouse && gameState == 1) {
        player.fire();
    }
}


function mouseMoved() {
    if (addCollider == "rect") {
        if (newCollider.x1) {
            newCollider.x2 = cap(mouseX/scale, newCollider.x1, referenceWidth);
            newCollider.y2 = cap(mouseY/scale, newCollider.y1, referenceHeight);
        } 
    }
    if (addCollider == "grass") {
        if (newCollider.x1) {
            newCollider.x2 = cap(mouseX/scale, newCollider.x1, referenceWidth);
            newCollider.y2 = cap(mouseY/scale, newCollider.y1, referenceHeight);
        } 
    }

    if (addCollider == "circle") {
        if (newCollider.x) {
            newCollider.r = dist(newCollider.x,newCollider.y,mouseX/scale,mouseY/scale);
        }
    }
}