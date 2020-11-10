// The necessary constants to make canvas work!
const canvas = document.querySelector("#mycanvas");
const ctx = canvas.getContext("2d");

// Some practice with a few functions within canvas.
// ctx.fillStyle = "red";
// ctx.fillRect(20, 20, 150, 100);

// ctx.beginPath();
// ctx.moveTo(20, 20);
// ctx.lineTo(20, 100);
// ctx.lineTo(70, 100);
// ctx.stroke();

let painting = false; 

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

    // Properties 
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

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

canvas.addEventListener('mousemove', drawStroke);
canvas.addEventListener('mouseup', finishStroke);
canvas.addEventListener('mousedown', startStroke);