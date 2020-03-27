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

let newPatch = {};

function mousePressed() {
    if (creatingLevel && !newPatch.x1) {
        newPatch.x1 = mouseX/scale;
        newPatch.y1 = mouseY/scale;
    } else if (creatingLevel) {
        level.environment.grass.push({'x1': newPatch.x1, 'y1': newPatch.y1, 'x2': newPatch.x2, 'y2': newPatch.y2});
        newPatch = {};
    }
    if (mouseY < 30 && mouseX <30) { // nts fricking lelijk
        gameState = 2;
    } else if (controls.fireWithMouse && gameState == 1) {
        player.fire();
    }
}

function mouseReleased() {
    if (creatingLevel) {
        
    }
}

function mouseMoved() {
    if (newPatch.x1) {
        newPatch.x2 = mouseX/scale;
        newPatch.y2 = mouseY/scale;
    }  
}