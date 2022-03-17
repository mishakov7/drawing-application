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

    let pixelQueue = [[mouseX, mouseY]];

    // This loop will go on until the queue is empty.
    while (pixelQueue.length > 0) {
        currentPixel = pixelQueue.shift();
        x = currentPixel[0];
        y = currentPixel[1];

        // Index of the pixel in the big pixel array
        pixelIndex = (y * canvas.width + x) * 4;

        // If the color does NOT match, it simply
        // enters the next iteration of the loop and thus, the next element in the stack.
        if (matchMouseColor(pixelIndex) == false) {
            continue;
        }

        colorPixel(pixelIndex, fillColor);
        pushNeighbors(pixelQueue, x, y);
    }

    ctx.putImageData(canvasPixels, 0, 0);

}

// This functions adds pixel coordinates to the queue.
function pushNeighbors(queue, x, y) {
    // y-- : going up
    // y++ : going down
    // x-- : going left
    // x++ : going right

    // Right, Left, Down, Up
    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
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

    if (rgbStr[0] == "#") 
        rgbStr = hexToRgb(rgbStr);

    console.log(rgbStr);

    rgbArr = rgbStr.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    
    return [rgbArr[1], rgbArr[2], rgbArr[3]];

}

function hexToRgb(c){
    if(/^#([a-f0-9]{3}){1,2}$/.test(c)){
        if(c.length== 4){
            c= '#'+[c[1], c[1], c[2], c[2], c[3], c[3]].join('');
        }
        c= '0x'+c.substring(1);
        return 'rgb('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
    }
    return '';
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