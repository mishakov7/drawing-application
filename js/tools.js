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
		//this.setColor();
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
		this.setColor();
        this.setSize();
        ctx.globalCompositeOperation = this.operation;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
    }

    setSize() {
        const label = document.querySelector("#" + this.elmt.id + "-size");
        const slider = document.querySelector("#" + this.elmt.id + "-slider");

        slider.addEventListener("input", function() {
            label.innerHTML = slider.value;
        });

        this.size = slider.value;
    }

    toggleSlider(toggle) {
        const sliderContainer = document.querySelector("#" + this.elmt.id + "-slider-wrapper");

        if (toggle)
            sliderContainer.style.display = "block";

        else
            sliderContainer.style.display = "none";
    }

    // Occurs when the mouse is pressed (and held)
    startStroke(e) {
        if (this.selected) {
            this.painting = true;
            savedCanvas.push(canvas.toDataURL("image/png"));

            // Allows you to create dots on the canvas.
            canvas.addEventListener('mousemove', this.drawStroke.bind(this));

        }
    }

    // Occurs as the mouse is moved while being pressed.
    drawStroke(e) {
        if (!this.painting) {
            return;
        }

        this.toggleSlider(false);

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
		
		canvas.removeEventListener('mousemove', this.drawStroke.bind(this));

    }

    enableListeners() {
        const slider = document.querySelector("#" + this.elmt.id + "-slider");
        const sizeLabel = document.querySelector("#" + this.elmt.id + "-size");

        canvas.addEventListener('mouseup', this.finishStroke.bind(this));
        canvas.addEventListener('mousedown', this.startStroke.bind(this));
        slider.addEventListener('change', this.setSize.bind(this));
        sizeLabel.addEventListener('click', this.toggleSlider.bind(this));

        // console.log("enabled " + this.elmt.id);
    }

    disableListeners() {
        canvas.removeEventListener('mouseup', this.finishStroke.bind(this));
        canvas.removeEventListener('mousedown', this.startStroke.bind(this));
        // console.log("disabled " + this.elmt.id);
    }

}

class Fill extends Tool {
    constructor(elmt, selected, cursor, color, mouseColor) {
        super(elmt, selected, cursor, color);

        this.mouseColor = mouseColor;
    }

    enableListeners() {
        canvas.addEventListener('click', this.fillArea.bind(this));
        // console.log("enabled " + this.elmt.id);
    }
    
    disableListeners() {
        canvas.removeEventListener('click', this.fillArea.bind(this));
        // console.log("disable " + this.elmt.id);
    }

    fillArea(e) {

        if (this.selected) {

            this.disableListeners();

            // Pixel data
            var canvasPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
            savedCanvas.push(canvas.toDataURL("image/png"));

            // Mouse coordinates
            let mouseX = e.clientX - canvas.offsetLeft + 25;
            let mouseY = e.clientY - canvas.offsetTop + 25;
        
            // Mouse coordinate pixel data
            this.mouseColor = this.findMouseColor(canvasPixels, mouseX, mouseY);

            // Fill color pixel data
            let fillColor = this.findFillColor();

            if (String(this.mouseColor) != String(fillColor)) {
                
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
                    if (this.matchMouseColor(canvasPixels, pixelIndex))
                        this.colorPixel(canvasPixels, pixelIndex, fillColor);

                    else 
                        continue;

                    // if (pixelQueue.length > 6000)
                    //     break;

                    this.pushNeighbors(pixelQueue, x, y);
                }
            
                ctx.putImageData(canvasPixels, 0, 0);
            }
        }
    }

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