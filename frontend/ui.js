// --- ui things
/*let input;
let inputX = 0;
let inputY = 0;
let inputHeight = 15;
let inputWidth = 200;*/

let buttonMargin = 25;
let buttonX = 500

let nameBox;
//let buttonX = 500;
let nameBoxY = 100;
let nameBoxWidth = 225;
let nameBoxHeight = 50;

let colorBox;
let colorBoxWidth = 50;

let control;
//let controlX = buttonX ;
let controlY = 175;
let controlWidth = 300;
let controlHeight = 50;
let controlTextOffset = 0;

/*let checkbox; // this is way 2 much work for now...
let checkboxY = 200;
let checkboxWidth = 50;
let checkboxHeight = 50;
*/

let submit;
//let submitX = 500;
let submitY = 250;
let submitWidth = 300;
let submitHeight = 50;

function drawUI() {
    push();
    rectMode(CORNER);
    fill(UIBackgroundColor);
    rect(5, 5, 25, 25);
    //rect(30, 5, 25, 25);
    //rect(55, 5, 25, 25);
    fill(colors.black);
    //textAlign(CENTER,CENTER);
    textSize(25);
    text("O", 8, 7, 25, 25);
    //text("N", 30, 5, 29, 29);
    //text("F", 55, 5, 29, 29)
    pop();
}

function drawButtons() { // nts double calculations
    push();
    rectMode(CORNER);
    fill(buttonColor);

    // --- nameBox
    if (!nameBox) {
        nameBox = createInput(player.name);
        nameBox.input(updateName);
    }
    nameBox.position(buttonX*scale, nameBoxY*scale);
    nameBox.size(nameBoxWidth*scale, nameBoxHeight*scale);
    nameBox.style('font-size', '25px');
    rect(buttonX*scale, nameBoxY*scale, nameBoxWidth*scale, nameBoxHeight*scale);
    
    if (!colorBox) {
        colorBox = createButton("C");
        colorBox.mousePressed(changeColor);
    }
    colorBox.position((buttonX + nameBoxWidth + buttonMargin)*scale, nameBoxY*scale);
    colorBox.size(colorBoxWidth*scale, nameBoxHeight*scale);
    colorBox.style('font-size', '25px');
    colorBox.style('color', player.c);
    rect(colorBox.x,colorBox.y, colorBox.width, colorBox.height);

    // --- controls
    if (!control) {
        control = createButton("Change controls");
        control.mousePressed(changeControls);
    }
    control.position(buttonX*scale, controlY*scale, controlWidth*scale, controlHeight*scale);
    control.size(controlWidth*scale, controlHeight*scale);
    control.style('font-size', '25px');
    rect(buttonX*scale, controlY*scale, controlWidth*scale, controlHeight*scale);
    drawControlText();

    // --- submit
    if (!submit) {
        submit = createButton('done');
        submit.mousePressed(saveChanges);
    }
    submit.position(buttonX*scale, (submitY + controlTextOffset)*scale);
    submit.size(submitWidth*scale, submitHeight*scale);
    submit.style('font-size', '25px');
    rect(buttonX*scale, (submitY + controlTextOffset)*scale, submitWidth*scale, submitHeight*scale);
    
    pop();
}

function drawControlText() {
    push();
    textAlign(LEFT);
    textSize(25);
    fill('white');
    text(controlText, buttonX*scale, (controlY + controlHeight + 2*buttonMargin)*scale);
    pop();
}

function updateName() {
    player.name = nameBox.value();
}

function changeColor() {
    player.c = Object.keys(colors)[Object.keys(colors).length * Math.random() << 0]
}

function saveChanges() {
    //gameState = 1;
    controls.changing = 0;
    controlText = "";
    controlTextOffset = 0;
    nameBox.remove();
    nameBox = null;
    colorBox.remove();
    colorBox = null;
    submit.remove();
    submit = null;
    control.remove();
    control = null;
    state.done();
}