//
// pixelIndex = (y * canvas.width + x) * 4;
//
// traveling up
// pixelIndex -= canvas.width * 4;
//
// traveling down
// pixelIndex += canvas.width * 4;
//

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

// These are the stacks that represent the state of the
// canvas at different points in time.
let savedCanvas = [];
let removedCanvas = [];

<<<<<<< HEAD
ctx.fillStyle = "#3F3C4F";
ctx.fillRect(0, 0, 800, 500);


=======
>>>>>>> 3b8dbfdf17feb8dd3d0fe63cbe2c440e2b97f9c5
/**
 * CANVAS EVENT LISTENER
 * These event listeners define the main mechanics of the 
 * drawing tool. 
 */
addCanvasStroke();
chooseColor();

function addCanvasStroke() {
    canvas.addEventListener('mousemove', drawStroke);
    canvas.addEventListener('mouseup', finishStroke);
    canvas.addEventListener('mousedown', startStroke);
}

function removeCanvasStroke() {
    canvas.removeEventListener('mousemove', drawStroke);
    canvas.removeEventListener('mouseup', finishStroke);
    canvas.removeEventListener('mousedown', startStroke);
}

function addFillClick() {
    canvas.addEventListener('click', fillArea);
}

function removeFillClick() {
    canvas.removeEventListener('click', fillArea);
}

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

const undo = document.querySelector("#undo");
undo.addEventListener('click', undoAction);

const redo = document.querySelector("#redo");
redo.addEventListener('click', redoAction);

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

function enableBrush() {
    brushTool = true;
    eraseTool = false;
    fillTool = false;

    removeFillClick();
    addCanvasStroke();
}

function enableErase() {
    brushTool = false;
    eraseTool = true;
    fillTool = false;

    removeFillClick();
    addCanvasStroke();
}

function enableFill() {
    brushTool = false;
    eraseTool = false;
    fillTool = true;

    removeCanvasStroke();
    addFillClick();
}


function undoAction() {
    // When an action is undone, it gets saved (pushed)
    // to the removedCanvas stack.
    removedCanvas.push(canvas.toDataURL("image/png"));
    clear.click();

    let undoImage = new Image();

    undoImage.onload = function() {
        ctx.drawImage(undoImage, 0, 0);
    }

    // When an action is undone, the state of the canvas is
    // the most recent addition of the savedCanvas stack.
    // This then means that the most recent addition to the
    // savedCanvas stack is removed (popped).
    undoImage.src = savedCanvas.pop();
}

function redoAction() {
    // When an action is redone, it gets saved (pushed)
    // to the savedCanvas stack.
    savedCanvas.push(canvas.toDataURL("image/png"));
    clear.click();

    let redoImage = new Image();

    redoImage.onload = function() {
        ctx.drawImage(redoImage, 0, 0);
    }

    // When an action is redone, the state of the canvas is
    // the most recent addition of the removedCanvas stack.
    // This then means that the most recent addition to the
    // removedCanvas stack is removed (popped).
    redoImage.src = removedCanvas.pop();
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
        return 'rgb(0, 0, 0)';
}

// This function allows us to switch between the different tools
// whenever they are clicked.
function selectTool() {
    const tool = this.id;

    switch (tool) {
        case "brushtool":
            enableBrush();
            break;

        case "erasetool":
            enableErase();
            break;

        case "filltool":
            enableFill();
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
    savedCanvas.push(canvas.toDataURL("image/png"));

    // Allows you to create dots on the canvas.
    drawStroke(e);
}

// Occurs when the mouse is released (from being held)
function finishStroke(e) {
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

// fill color

function fillArea(e) {
    // Mouse coordinates
    let mouseX = e.clientX - this.offsetLeft;
    let mouseY = e.clientY - this.offsetTop;
    let pixelStack = [[mouseX, mouseY]];

    // Pixel data
    canvasPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Mouse coordinate pixel data
    mouseColor = findMouseColor(mouseX, mouseY);

    // Fill color pixel data
    fillColor = findFillColor();

    while (pixelStack.length > 0) {
        currentPixel = pixelStack.pop();
        x = currentPixel[0];
        y = currentPixel[1];

        // Index of the pixel in the big pixel array
        pixelIndex = (y * canvas.width + x) * 4;
        
        // Travel up
        // y-- >= 0 : below the edge of the canvas
        // matchMouseColor - checks to see if the color we are landing on is the same color

        // y-- : going up
        // y++ : going down
        // x-- : going left
        // x++ : going right
        while ((y-- >= 0) && (matchMouseColor(pixelIndex) == true)) {
            pixelIndex -= canvas.width * 4;
        }

        pixelIndex += canvas.width * 4;
        y++;

        let lookLeft = false;
        let lookRight = false;

        while ((y++ < canvas.height) && (matchMouseColor(pixelIndex))) {
            colorPixel(pixelIndex, fillColor);

            // Look left
            if (x > 0) {

                if ((lookLeft == false) && (matchMouseColor(pixelIndex - 4))) {
                    let leftCoords = [x - 1, y];
                    pixelStack.push(leftCoords);
                    lookLeft = true;
                }

                else if (lookLeft == true) {
                    lookLeft = false;
                }
            }

            // Look right
            if (x < canvas.width - 1) {
                if ((lookRight == false) && (matchMouseColor(pixelIndex + 4))) {
                    let rightCoords = [x + 1, y];
                    pixelStack.push(rightCoords);
                    lookRight = true;
                }

                else if (lookRight == true) {
                    lookRight = false;
                }
            }

            pixelIndex += canvas.width * 4;
        }

    }

    ctx.putImageData(canvasPixels, 0, 0);

}

function findMouseColor(x, y) {
    index = (y * canvas.width + x) * 4;
    r = canvasPixels.data[index];
    g = canvasPixels.data[index + 1];
    b = canvasPixels.data[index + 2];
    a = canvasPixels.data[index + 3];

    return [r, g, b, a];
}

function findFillColor() {
    rgbStr = chooseColor();
    rgbArr = rgbStr.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return [rgbArr[1], rgbArr[2], rgbArr[3]];
}

function matchMouseColor(index) {
    r = canvasPixels.data[index];
    g = canvasPixels.data[index + 1];
    b = canvasPixels.data[index + 2];

    return (
        r == mouseColor[0] &&
        g == mouseColor[1] &&
        b == mouseColor[2] &&
        a == mouseColor[3]
    );
}

function colorPixel(index, color) {
    canvasPixels.data[index] = color[0];
    canvasPixels.data[index + 1] = color[1];
    canvasPixels.data[index + 2] = color[2];
    canvasPixels.data[index + 3] = color[3];
}