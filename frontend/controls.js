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
    if (controls.changing && keyCode == ESCAPE) {
        controls.changing = 0;
        controlText = "";
        controlTextOffset = 0;
    }

    if (keyCode === ESCAPE) {
        newCollider.empty = true;
        //state.done();
    }

    if (keyCode == controls.toggleLevelEditing) {
        if (state.is('editingLevel')) {
            console.log(JSON.stringify(level.environment));
            newCollider.empty = true;
            state.done();
        } else {
            state.editLevel();
        }
    }

    if (keyCode == controls.toggleColliderDestination) {
        newCollider.type = iterate(Collider.types,newCollider.type);
    }
    
    if (keyCode == controls.toggleColliderShape) {
        newCollider.shape = iterate(Collider.shapes, newCollider.shape);
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
        if (newCollider.empty) {
            newCollider.empty = false;
            newCollider.x1 = mouseX/scale;
            newCollider.y1 = mouseY/scale;
            newCollider.x2 = mouseX/scale;
            newCollider.y2 = mouseY/scale;
        } else { // newCollider is done
            level.environment[newCollider.type].push(new Collider(newCollider));
            newCollider.empty = true;
        }
    }
    
    if (state.is('game')) {
        if (mouseY/scale < optionX+optionWidth && mouseX/scale < optionY+optionHeight) {
            state.pause();
        } else if (controls.fireWithMouse) {
            player.fire();
        }
    }
}


function mouseMoved() {
    if (state.is('editingLevel')) {
        if (!newCollider.empty) {
            newCollider.x2 = mouseX/scale;
            newCollider.y2 = mouseY/scale;
        }
    }
}