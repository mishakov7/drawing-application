class Tool {
    constructor(element, selected, cursor) {
        this.element = element;
        this.selected = selected;
        this.cursor = cursor;
    }

    enable() {
        this.element.classList.add("tool-selected");
        this.selected = true;
    }

    disable() {
        this.element.classList.remove("tool-selected");
        this.selected = false;
    }
}

class Brush extends Tool {

    constructor(element, selected, cursor, painting, operation, size, color) {
        super(element, selected, cursor);

        this.painting = painting;
        this.operation = operation;
        this.size = size;
        this.color = color;
    }

    // We call this function specifically to set default properties.
    setProps() {
        ctx.globalCompositeOperation = this.operation;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.color;

        console.log("props set");

    }

    // Occurs when the mouse is pressed (and held)
    startStroke(e) {
        this.setProps();
        this.painting = true;
        // savedCanvas.push(canvas.toDataURL("image/png"));

        // Allows you to create dots on the canvas.
        canvas.addEventListener('mousemove', this.drawStroke.bind(this));
    }

    // Occurs as the mouse is moved while being pressed.
    drawStroke(e) {

        if (!this.painting) {
            return;
        }

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

    // Occurs when the mouse is released (from being held)
    finishStroke(e) {
        this.painting = false;

        canvas.removeEventListener('mousemove', this.drawStroke);

        // Prevents two consecutive strokes from being connected.
        ctx.beginPath();

    }

    addCanvasStroke() {
        canvas.addEventListener('mouseup', this.finishStroke.bind(this));
        canvas.addEventListener('mousedown', this.startStroke.bind(this));
    }

    removeCanvasStroke() {
        canvas.removeEventListener('mouseup', this.finishStroke);
        canvas.removeEventListener('mousedown', this.startStroke);
    }
    

}