// --- controls for things
let leftKey = 65;
let rightKey = 68;
let upKey = 87;
let downKey = 83;
let fireKey;

let controls = {
    'changing': 0, // none, left, right, up, down, fire
    'left': leftKey,
    'right': rightKey,
    'up': upKey,
    'down': downKey,
    'fireWithMouse': true,
    'fire': fireKey,
}


function changecontrols() {
    controls.changing = 1;
    let textBox = document.getElementById("controls");
    textBox.innerHTML = "listening for left input...";
}

function changeFire () {
    /*document.getElementById("fireWithMouse").blur();
    if (document.getElementById("fireWithMouse").checked) {
        controls.fireWithMouse = true;
    } else {
        controls.fireWithMouse = false;
    }*/
    controls.fireWithMouse = !controls.fireWithMouse;
    changecontrols();
}

function keyPressed() {
    //#region changing controls DIT IS HECKA LELIJK
    //let textBox = document.getElementById("controls");
    switch(controls.changing) {
        case 0: // the controls dont need changing
            if (keyCode == controls.fire) {
                player.fire();
            }
            break;
        case 1: // the left needs changing
            controls.left = keyCode;
            textBox.innerHTML = "listening for right input...";
            controls.changing++;
            break;
        case 2: // the right needs changing
            controls.right = keyCode;
            textBox.innerHTML = "listening for up input...";
            controls.changing++;
            break;
        case 3: // the up needs changing
            controls.up = keyCode;
            textBox.innerHTML = "listening for down input...";
            controls.changing++;
            break;
        case 4: // the down needs changing
            controls.down = keyCode;
            if (controls.fireWithMouse) { // end configuration early
                textBox.innerHTML = "click <u>here</u> to change controls";
                //textBox.style.visibility = "invisible";
                controls.changing = 0;
            } else {
                textBox.innerHTML = "listening for fire input...";
                controls.changing++;
            }
            break;
        case 5: // the fire needs changing
            controls.fire = keyCode;
            textBox.innerHTML = "click <u>here</u> to change controls";
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
    if (mouseY < 30 && mouseX <80) { // nts fricking lelijk
        gameState = 2;
        if (mouseX < 30) { // change controlls
            //changecontrols();
        } else if (mouseX < 55) { // change name
            //player.name = prompt("new name:");
        } else if (mouseX < 80) { // change fire
            //changeFire();
        }
    }
    if (controls.fireWithMouse) {
        player.fire();
    }
}