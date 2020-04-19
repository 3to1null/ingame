// --- ui things
let fontSize = 25;

let optionWidth = 30;
let optionHeight = 30;
let optionX = 0;
let optionY = 0;

let buttonMargin = 25;
let buttonX = 500

let nameBox;
let nameBoxY = 100;
let nameBoxWidth = 225;
let nameBoxHeight = 50;

let colorBox;
let colorBoxWidth = 50;

let control;
let controlY = 175;
let controlWidth = 300;
let controlHeight = 50;
let controlTextOffset = 0;

let submit;
let submitY = 250;
let submitWidth = 300;
let submitHeight = 50;

let textX = 100;
let textY = fontSize;


function drawUI() {
    push();
    rectMode(CORNER);
    fill(UIBackgroundColor);
    // rect(optionX*scale, optionY*scale, optionWidth*scale, optionHeight*scale);
    image(images.gear, optionX*scale, optionY*scale, optionWidth*scale, optionHeight*scale)
    fill(textColor);
    textSize(fontSize*scale);
    textAlign(LEFT);
    text(`Level: ${level.title} | Score: ${player.score} | Time left: ${level.timeLeft}`, optionWidth*scale, textY*scale);
    pop();
}

function drawButtons() { // nts double calculations
    push();
    rectMode(CORNER);
    fill(buttonColor);

    // --- nameBox
    if (!nameBox) {
        nameBox = createInput((player.name === player.c) ? "" : player.name);
        nameBox.attribute('placeholder', 'Your name');
        nameBox.input(updateName);
    }
    nameBox.position(buttonX*scale, nameBoxY*scale);
    nameBox.size(nameBoxWidth*scale, nameBoxHeight*scale);
    nameBox.style('font-size', fontSize*scale + 'px');
    nameBox.style('color', player.c);
    rect(buttonX*scale, nameBoxY*scale, nameBoxWidth*scale, nameBoxHeight*scale);
    
    if (!colorBox) {
        colorBox = createButton("C");
        colorBox.mousePressed(changeColor);
    }
    colorBox.position((buttonX + nameBoxWidth + buttonMargin)*scale, nameBoxY*scale);
    colorBox.size(colorBoxWidth*scale, nameBoxHeight*scale);
    colorBox.style('font-size', fontSize*scale + 'px');
    colorBox.style('color', player.c);
    rect(colorBox.x,colorBox.y, colorBox.width, colorBox.height);
    rect(colorBox.x,colorBox.y, colorBox.width, colorBox.height);

    // --- controls
    if (!control) {
        control = createButton("Change controls");
        control.mousePressed(changeControls);
    }
    control.position(buttonX*scale, controlY*scale, controlWidth*scale, controlHeight*scale);
    control.size(controlWidth*scale, controlHeight*scale);
    control.style('font-size', fontSize*scale + 'px');
    rect(buttonX*scale, controlY*scale, controlWidth*scale, controlHeight*scale);
    drawControlText();

    // --- submit
    if (!submit) {
        submit = createButton('done');
        submit.mousePressed(saveChanges);
    }
    submit.position(buttonX*scale, (submitY + controlTextOffset)*scale);
    submit.size(submitWidth*scale, submitHeight*scale);
    submit.style('font-size', fontSize*scale + 'px');
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
    nameBox.style('color', player.c);
}

function saveChanges() {
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