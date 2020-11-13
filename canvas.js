// The necessary constants to make canvas work!
const canvas = document.querySelector("#mycanvas");
const ctx = canvas.getContext("2d");

/**
 * VARIABLES / FLAGS
 * These variables indicate what "tool" or feature is being 
 * turned on. The default settings are enabled.
 * 
 * When the app opens, the brush is the default tool.
 */
let painting = false; 
let brushTool = true;
let eraseTool = false;
let fillTool = false;
let colorClicked = false;

/**
 * CANVAS EVENT LISTENER
 * These event listeners define the main mechanics of the 
 * drawing tool. 
 */
canvas.addEventListener('mousemove', drawStroke);
canvas.addEventListener('mouseup', finishStroke);
canvas.addEventListener('mousedown', startStroke);

/**
 * TOOL EVENT LISTENER
 * The following lines of code define the elements of the
 * tools being used, and the function that is being called
 * whenever the tools are being clicked on.
 */
const brush = document.querySelector("#brushtool");
brush.addEventListener('click', selectTool);

const erase = document.querySelector("#erasetool");
erase.addEventListener('click', selectTool);

const fill = document.querySelector("#filltool");
fill.addEventListener('click', selectTool);

const clear = document.querySelector("#clearimg");
clear.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const download = document.querySelector("#downloadimg");
download.onclick  = function() {
    url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    // NOTE: The method used before only worked in Firefox. 
    // This method is compatible with Chrome.
    var link = document.createElement('a');
    link.download = "drawing.png";
    link.href = url;
    link.click();
}

// This function will allow for a color to be selected.
function chooseColor() {
    // This groups all the colors into an array.
    const colors = document.querySelectorAll(".color");

    // This for loop allows us to enter the array so we could
    // detect every color that has the potential to be clicked.
    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', function(){

            // The color flag changes.
            colorClicked = true;

            // When a color is clicked, the tool is reset back to brush.
            brushTool = true;
            eraseTool = false;
            fillTool = false;

            // This branching identifies whether the color picked was
            // a preset color, or a color derived from the color picker.
            if (this.value == undefined)
                colorChoice = this.style.backgroundColor;
            else
                this.addEventListener('change', function() {
                    colorChoice = this.value; 
                });           
        });
    }

    // This branching determines whether to choose the default color, or 
    // a color picked from the event handler. 
    if (colorClicked)
        return colorChoice;
    else
        return 'black';
}

// This function allows us to switch between the different tools
// whenever they are clicked.
function selectTool() {
    const tool = this.id;

    switch (tool) {
        case "brushtool":
            brushTool = true;
            eraseTool = false;
            fillTool = false;
            break;

        case "erasetool":
            brushTool = false;
            eraseTool = true;
            fillTool = false;
            break;

        case "filltool":
            console.log("you clicked the fill tool.");
            break;

        default:
            break;
    }
}

/**
 * PROPERTIES
 * When drawing, there are many different properties a
 * tool can take on. This function switches between 
 * those properties depending on the tool.
 */
function selectProps() {
    if (brushTool) {
        // This is the main attribute that distinguishes its "brush" property.
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';

        // The color is chosen depending on it being chosen or default.
        ctx.strokeStyle = chooseColor();
    }

    if (eraseTool) {
        // This is the main attribute that distinguishes its "eraser" property.
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';
    }
}

// Occurs when the mouse is pressed (and held)
function startStroke(e) {
    painting = true;

    // Allows you to create dots on the canvas.
    drawStroke(e);
}

// Occurs when the mouse is released (from being held)
function finishStroke() {
    painting = false;

    // Prevents two consecutive strokes from being connected.
    ctx.beginPath();
}

// Occurs as the mouse is moved while being pressed.
function drawStroke(e) {
    if (!painting) {
        return;
    }

    selectProps();

    // Identifies the precise position of the mouse.
    let mouseX = e.clientX - this.offsetLeft;
    let mouseY = e.clientY - this.offsetTop;

    // This creates a "line" wherever the mouse is at its starting position. 
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    // As the mouse moves, a path is created and will move concurrently until the mouse is released.
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
}