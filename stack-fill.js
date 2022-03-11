// fill color

function fillArea(e) {
    // Mouse coordinates
    let mouseX = e.clientX - this.offsetLeft;
    let mouseY = e.clientY - this.offsetTop;

    // Pixel data
    canvasPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Mouse coordinate pixel data
    mouseColor = findMouseColor(mouseX, mouseY);

    // Fill color pixel data
    fillColor = findFillColor();

    let pixelStack = [[mouseX, mouseY]];

    // This loop will go on until the stack is empty.
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

        // Flags used to mark whether or not to push the left/right pixels to the stack.
        let lookLeft = false;
        let lookRight = false;

        // Travel down
        // y++ < canvas.height : above the edge of the canvas
        // matchMouseColor - checks to see if the color we are landing on is the same color
        while ((y++ < canvas.height) && (matchMouseColor(pixelIndex))) {
            colorPixel(pixelIndex, fillColor);

            // Look left
            if (x > 0) {

                if ((lookLeft == false) && (matchMouseColor(pixelIndex - 4))) {
                    let leftCoords = [x - 1, y];

                    // If all consecutive pixels below this pushed pixel
                    // are the same color, they will NOT be pushed to the stack.
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

                    // If all consecutive pixels below this pushed pixel
                    // are the same color, they will NOT be pushed to the stack.
                    pixelStack.push(rightCoords);
                    lookRight = true;
                }

                else if (lookRight == true) {
                    lookRight = false;
                }
            }

            // This resets the index.
            pixelIndex += canvas.width * 4;
        }

    }

    // This formally instantiates the fill.
    ctx.putImageData(canvasPixels, 0, 0);

}


// This function determines the color that was picked.
// EDIT MADE HERE: a is taken OUT.
function findMouseColor(x, y) {
    index = (y * canvas.width + x) * 4;
    r = canvasPixels.data[index];
    g = canvasPixels.data[index + 1];
    b = canvasPixels.data[index + 2];
    return [r, g, b];
}

// This function determines the color we are filling with.
function findFillColor() {
    rgbStr = chooseColor();
    rgbArr = rgbStr.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return [rgbArr[1], rgbArr[2], rgbArr[3]];
}

// This function identifies whether or not the current pixel matches the original pixel.
// EDIT MADE HERE: a is taken OUT.
function matchMouseColor(index) {
    r = canvasPixels.data[index];
    g = canvasPixels.data[index + 1];
    b = canvasPixels.data[index + 2];

    return (
        r == mouseColor[0] &&
        g == mouseColor[1] &&
        b == mouseColor[2]
    );
}

// This function colors pixels with the specified fill color.
// EDIT MADE HERE: a is replaced with 255.
function colorPixel(index, color) {
    canvasPixels.data[index] = color[0];
    canvasPixels.data[index + 1] = color[1];
    canvasPixels.data[index + 2] = color[2];
    canvasPixels.data[index + 3] = 255;
}