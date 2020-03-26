// --- ui things
let input;
let inputX = 0;
let inputY = 0;
let inputHeight = 15;
let inputWidth = 200;

let ButtonMargin = 25;

let nameBox;
let nameBoxX = 500;
let nameBoxY = 100;
let nameBoxWidth = 200;
let nameBoxHeight = 50;

let submit;
let submitX = 500;
let submitY = 200;
let submitWidth = 100;
let submitHeight = 50;

function drawUI() {
    //drawButtons();
    return;
    push();
    rectMode(CORNER);
    fill(UIBackgroundColor);
    rect(5, 5, 25, 25);
    rect(30, 5, 25, 25);
    rect(55, 5, 25, 25);
    fill(colors.black);
    textAlign(CENTER,CENTER);
    textSize(25);
    text("C", 5, 5, 29, 29);
    text("N", 30, 5, 29, 29);
    text("F", 55, 5, 29, 29)
    pop();
}

function drawButtons() {
    push();
    rectMode(CORNER);
    fill(buttonColor);

    // --- nameBox
    if (!nameBox) {
        nameBox = createInput(player.name);
        nameBox.position(nameBoxX*scale, nameBoxY*scale);
        nameBox.size(nameBoxWidth*scale, nameBoxHeight*scale);
        nameBox.style('font-size', '25px');
        nameBox.input(updateName);
    }
    rect(nameBoxX*scale, nameBoxY*scale, nameBoxWidth*scale, nameBoxHeight*scale);
    
    

    // --- submit
    if (!submit) {
        submit = createButton('done');
        submit.position(submitX*scale, submitY*scale);
        submit.size(submitWidth*scale, submitHeight*scale);
        submit.style('font-size', '25px');
        submit.mousePressed(saveChanges);
        //submit.style('background-color', buttonColor.toString('#rrggbbaa'));
    }
    rect(submitX*scale, submitY*scale, submitWidth*scale, submitHeight*scale);


    pop();
}

function updateName() {
    player.name = nameBox.value();
}

function saveChanges() {
    gameState = 1;
    nameBox.remove();
    nameBox = null;
    submit.remove();
    submit = null;
}