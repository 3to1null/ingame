// --- controls for things
let controlText;

let WAITINGONINPUT = false;

let controls = {
    'changing': 0, // none, left, right, up, down, fire
    'left': 65,
    'right': 68,
    'up': 87,
    'down': 83,
    'fireWithMouse': true,
    //'fire': fireKey,
    'toggleColliderShape': 86, // v
    'toggleColliderDestination': 67, // c
    'toggleLevelEditing': 69, // LMAO // e 
    //'addGrassPatch': 71 // g
    //'escapeCollider': ESCAPE
}


function changeControls() {
    state.editControls();
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

    // if(keyCode == controls.addCircleCollider) {
    //     addCollider = "circle";

    // }
    // if (keyCode == controls.addRectCollider) {
    //     addCollider = "rect";
    // }
    if (keyCode === ESCAPE) {
        //addCollider = "none";
        newCollider = {};
        state.done();
    }

    if (keyCode == controls.toggleLevelEditing) {
        if (state.is('editingLevel')) {
            console.log(JSON.stringify(level.environment));
            newCollider = {};
            state.done();
        } else {
            state.editLevel();
        }
    }

    if (keyCode == controls.toggleColliderDestination) {
        // state.editLevel();
        addCollider.destination = (addCollider.destination === "grass") ? "colliders" : "grass";
    }
    
    if (keyCode == controls.toggleColliderShape) {
        // state.editLevel();
        if (addCollider.shape == "rect") {
            newCollider = {'x': newCollider.x1, 'y': newCollider.y1, 'r': dist(newCollider.x1,newCollider.y1,mouseX/scale,mouseY/scale)};
        } else {
            newCollider = {'x1': newCollider.x, 'y1': newCollider.y, 'x2': mouseX/scale, 'y2': mouseY/scale}
        }
        addCollider.shape = (addCollider.shape === "rect") ? "circle" : "rect";
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
                state.done();
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
    if(state.is('editingLevel')) {
        if (addCollider.shape == "rect" ) {
            if (!newCollider.x1) {
                newCollider = {'x1': mouseX/scale, 'y1': mouseY/scale, 'x2': mouseX/scale, 'y2': mouseY/scale}  
            } else {
                level.environment[addCollider.destination].push(new ColliderRect(newCollider.x1,newCollider.y1,newCollider.x2,newCollider.y2));
                newCollider = {};
            }
        }
        
        if (addCollider.shape == "circle") {
            if (!newCollider.x) {
                newCollider = {'x': mouseX/scale, 'y': mouseY/scale, 'r': 0};
            } else {
                level.environment[addCollider.destination].push(new ColliderCircle(newCollider.x,newCollider.y,newCollider.r));
                newCollider = {};
            } 
        }
    }
    
    // if (addCollider == "grass") {
    //     if (!newCollider.x1) {
    //         newCollider = {'x1': mouseX/scale, 'y1': mouseY/scale, 'x2': mouseX/scale, 'y2': mouseY/scale}  
    //     } else {
    //         level.environment.grass.push(new ColliderRect(newCollider.x1,newCollider.y1,newCollider.x2,newCollider.y2));
    //         newCollider = {};
    //     }
    // }
    if (state.is('game')) {
        if (mouseY < 30 && mouseX <30) { // nts fricking lelijk
            state.pause();
            
            //addCollider = "none";
            // newCollider = {};
            // } else if (controls.fireWithMouse && gameState == 1) {
        } else if (controls.fireWithMouse) {
            player.fire();
        }
    }
}


function mouseMoved() {
    if (addCollider.shape == "rect") {
        if (newCollider.x1) {
            newCollider.x2 = cap(mouseX/scale, newCollider.x1, referenceWidth);
            newCollider.y2 = cap(mouseY/scale, newCollider.y1, referenceHeight);
        } 
    }
    // if (addCollider == "grass") {
    //     if (newCollider.x1) {
    //         newCollider.x2 = cap(mouseX/scale, newCollider.x1, referenceWidth);
    //         newCollider.y2 = cap(mouseY/scale, newCollider.y1, referenceHeight);
    //     } 
    // }

    if (addCollider.shape == "circle") {
        if (newCollider.x) {
            newCollider.r = dist(newCollider.x,newCollider.y,mouseX/scale,mouseY/scale);
        }
    }
}