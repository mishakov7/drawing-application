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
		this.elmt.classList.add("tool-selected");
		canvas.style.cursor = this.cursor;
        this.setProps();
    }

    disable() {
		this.selected = false;
        this.elmt.classList.remove("tool-selected");
    }

    setColor() {
        ctx.strokeStyle = this.color;
        this.elmt.style.borderColor = this.color;
    }

    setProps() {
        
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
        this.painting = true;

        // Allows you to create dots on the canvas.
        canvas.addEventListener('mousemove', this.drawStroke.bind(this));

        this.setColor();
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

    addCanvasStroke() {
        canvas.addEventListener('mouseup', this.finishStroke.bind(this));
        canvas.addEventListener('mousedown', this.startStroke.bind(this));
    }

    removeCanvasStroke() {
        canvas.removeEventListener('mouseup', this.finishStroke.bind(this));
        canvas.removeEventListener('mousedown', this.startStroke.bind(this));
    }
	
    

}

class Fill extends Tool {
    constructor(elmt, selected, cursor, color) {
        super(elmt, selected, cursor, color);
    }
}