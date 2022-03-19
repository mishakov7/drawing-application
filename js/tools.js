const canvas = document.querySelector("#mycanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.querySelector("#colorpicker");
const palette = document.querySelectorAll(".color");
let colorClicked = false;

class Tool {
    constructor(elmt, selected, cursor, color) {
        this.elmt = elmt;
        this.selected = selected;
        this.cursor = cursor;
        this.color = color;
    }

    enable() {
		disableAll(); 

        this.selected = true;
        this.enableListeners();

		this.elmt.classList.add("tool-selected");
		canvas.style.cursor = this.cursor;
        this.setProps();
    }

    disable() {
		this.selected = false;
        this.disableListeners();

        this.elmt.classList.remove("tool-selected");
    }

    setColor() {
        ctx.strokeStyle = this.color;
        this.elmt.style.borderColor = this.color;
    }

    setProps() {
        
    }

    enableListeners() {

    }

    disableListeners() {

    }
}

class Brush extends Tool {

    constructor(elmt, selected, cursor, color, painting, operation, size) {
        super(elmt, selected, cursor, color);

        this.painting = painting;
        this.operation = operation;
        this.size = size;
    }


    // We call this function specifically to set default properties.
    setProps() {
        ctx.globalCompositeOperation = this.operation;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
    }

    // Occurs when the mouse is pressed (and held)
    startStroke(e) {
        if (this.selected) {
            this.painting = true;

            // Allows you to create dots on the canvas.
            canvas.addEventListener('mousemove', this.drawStroke.bind(this));

            this.setColor();
        }
    }

    // Occurs as the mouse is moved while being pressed.
    drawStroke(e) {
        if (!this.painting) {
            return;
        }

        // Identifies the precise position of the mouse.
        let mouseX = e.clientX - canvas.offsetLeft;
        let mouseY = e.clientY - canvas.offsetTop + 25;
		
		//console.log(e.offsetLeft + ", " + e.offsetTop);

        // This creates a "line" wherever the mouse is at its starting position. 
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();

        // As the mouse moves, a path is created and will move concurrently until the mouse is released.
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
    }

    // Occurs when the mouse is released (from being held)
    finishStroke(e) {
        this.painting = false;

        // Prevents two consecutive strokes from being connected.
        ctx.beginPath();
		
		canvas.removeEventListener('mousemove', this.drawStroke);

    }

    enableListeners() {
        canvas.addEventListener('mouseup', this.finishStroke.bind(this));
        canvas.addEventListener('mousedown', this.startStroke.bind(this));
        console.log("enabled " + this.elmt.id);
    }

    disableListeners() {
        canvas.removeEventListener('mouseup', this.finishStroke.bind(this));
        canvas.removeEventListener('mousedown', this.startStroke.bind(this));
        console.log("disabled " + this.elmt.id);
    }

}

class Fill extends Tool {
    constructor(elmt, selected, cursor, color, mouseColor) {
        super(elmt, selected, cursor, color);

        this.mouseColor = mouseColor;
    }

    enableListeners() {
        canvas.addEventListener('click', this.fillArea.bind(this));
        console.log("enabled " + this.elmt.id);
    }
    
    disableListeners() {
        canvas.removeEventListener('click', this.fillArea.bind(this));
        console.log("disable " + this.elmt.id);
    }

    fillArea(e) {

        e.stopPropagation();
        e.preventDefault();

        if (this.selected) {

            // Pixel data
            var canvasPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Mouse coordinates
            let mouseX = e.clientX - canvas.offsetLeft + 25;
            let mouseY = e.clientY - canvas.offsetTop + 25;
        
            // Mouse coordinate pixel data
            this.mouseColor = this.findMouseColor(canvasPixels, mouseX, mouseY);
        
            // Fill color pixel data
            let fillColor = this.findFillColor();

            console.log(this.mouseColor);
        
            let pixelQueue = [[mouseX, mouseY]];
        
            // This loop will go on until the queue is empty.
            while (pixelQueue.length > 0) {
                let currentPixel = pixelQueue.shift();
                let x = currentPixel[0];
                let y = currentPixel[1];
        
                // Index of the pixel in the big pixel array
                let pixelIndex = (y * canvas.width + x) * 4;
        
                // If the color does NOT match, it simply
                // enters the next iteration of the loop and thus, the next element in the stack.
                if (!this.matchMouseColor(canvasPixels, pixelIndex))
                    continue;

                if (this.matchMouseColor(canvasPixels, pixelIndex))
                    this.colorPixel(canvasPixels, pixelIndex, fillColor);

                this.pushNeighbors(pixelQueue, x, y);
            }
        
            ctx.putImageData(canvasPixels, 0, 0);
        }
    
    }

    // Stack Implementation
    /*fillArea(e) {
        if (this.selected) {

            var canvasPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Mouse coordinates
            let mouseX = e.clientX - canvas.offsetLeft + 25;
            let mouseY = e.clientY - canvas.offsetTop + 25;
        
            // Mouse coordinate pixel data
            this.mouseColor = this.findMouseColor(canvasPixels, mouseX, mouseY);
        
            // Fill color pixel data
            let fillColor = this.findFillColor();

            let pixelStack = [[mouseX, mouseY]];

            // This loop will go on until the stack is empty.
            while (pixelStack.length > 0) {
                let currentPixel = pixelStack.pop();
                let x = currentPixel[0];
                let y = currentPixel[1];

                // Index of the pixel in the big pixel array
                let pixelIndex = (y * canvas.width + x) * 4;
                
                while ((y-- >= 0) && (this.matchMouseColor(canvasPixels, pixelIndex) == true)) {
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
                while ((y++ < canvas.height) && (this.matchMouseColor(canvasPixels, pixelIndex))) {
                    this.colorPixel(canvasPixels, pixelIndex, fillColor);

                    // Look left
                    if (x > 0) {

                        if ((lookLeft == false) && (this.matchMouseColor(canvasPixels, pixelIndex - 4))) {
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
                        if ((lookRight == false) && (this.matchMouseColor(canvasPixels, pixelIndex + 4))) {
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
    }*/

    pushNeighbors(queue, x, y) {
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
    }

    findMouseColor(pixels, x, y) {
        let index = (y * canvas.width + x) * 4;
        let r = pixels.data[index];
        let g = pixels.data[index + 1];
        let b = pixels.data[index + 2];
        return [r, g, b];
    }

    matchMouseColor(pixels, index) {
        let r = pixels.data[index];
        let g = pixels.data[index + 1];
        let b = pixels.data[index + 2];
    
        return (
            r == this.mouseColor[0] &&
            g == this.mouseColor[1] &&
            b == this.mouseColor[2]
        );
    }

    findFillColor() {
        // this.color = chooseColor();
    
        if (this.color[0] == "#") 
            this.color = this.hexToRgb(this.color);
    
        var rgbArr = this.color.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
        
        return [rgbArr[1], rgbArr[2], rgbArr[3]];
    
    }

    hexToRgb(c){
        if(/^#([a-f0-9]{3}){1,2}$/.test(c)){
            if(c.length== 4){
                c= '#'+[c[1], c[1], c[2], c[2], c[3], c[3]].join('');
            }
            c= '0x'+c.substring(1);
            return 'rgb('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
        }
        return '';
    }
    
    colorPixel(pixels, index, color) {
        pixels.data[index] = color[0];
        pixels.data[index + 1] = color[1];
        pixels.data[index + 2] = color[2];
        pixels.data[index + 3] = 255;
    }
}