const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    false,
    "url('public/paintbrush.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "source-over"
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "url('public/eraser.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "destination-out"
);

const FillTool = new Fill(
    document.querySelector("#filltool"),
    false,
    "url('public/fill.svg'), auto",
    "rgb(255, 255, 255)"
);

// Default tool
PaintBrush.enable();

// Event listener functions
chooseColor();

EraserBrush.elmt.addEventListener('click', function () {
    EraserBrush.enable();
    PaintBrush.toggleSlider(false);
}, false);

PaintBrush.elmt.addEventListener('click', function () {
    PaintBrush.enable();
    EraserBrush.toggleSlider(false);
}, false);

FillTool.elmt.addEventListener('click', function () {
    FillTool.enable();
    PaintBrush.toggleSlider(false);
    EraserBrush.toggleSlider(false);
}, false);

document.addEventListener('keydown', (event) => {

    switch(event.key) {
        case 'b':
            PaintBrush.enable();
            EraserBrush.toggleSlider(false);
            break;

        case 'e':
            EraserBrush.enable();
            PaintBrush.toggleSlider(false);
            break;

        case 'f':
            FillTool.enable();
            PaintBrush.toggleSlider(false);
            EraserBrush.toggleSlider(false);
            break;

        case 'c':
            colorPicker.click();
            break;

        default: 
            break;
    }

});

const PaintSize = document.querySelector("#" + PaintBrush.elmt.id + "-size");
const EraserSize = document.querySelector("#" + EraserBrush.elmt.id + "-size");

EraserSize.addEventListener('click', function () {
    EraserBrush.enable();
    PaintBrush.toggleSlider(false);
}, false);

PaintSize.addEventListener('click', function () {
    PaintBrush.enable();
    EraserBrush.toggleSlider(false);
}, false);

function disableAll() {
	PaintBrush.disable();
    EraserBrush.disable();
    FillTool.disable();
}


function chooseColor() {
	
	if (!colorClicked) {
        setToolColor('rgb(255, 255, 255)');
    }
	
	colorPicker.addEventListener('input', function() {
		colorClicked = true;
		setToolColor(colorPicker.value);
	});

	// This is for a VERY specific instance where the user clicks on the color selector and does not change ANYTHING.
	colorPicker.addEventListener('click', function() {
		colorPicker.addEventListener('click', function() {
			colorClicked = true;
			setToolColor(colorPicker.value);
		});
	});
	
	palette.forEach(function(color){
		color.addEventListener("click", function() {
			colorClicked = true;
			setToolColor(color.style.backgroundColor);
		});
	});
	
	colorClicked = false;

}


function setToolColor(value) {

		
    if (PaintBrush.selected) {
		PaintBrush.color = value;
        PaintBrush.setColor();
	}
	
	if (FillTool.selected)  {
		FillTool.color = value;
        FillTool.setColor();
	} 
	
	if (colorClicked && EraserBrush.selected) {
		disableAll();
		PaintBrush.enable();
		PaintBrush.color = value;
		PaintBrush.setColor();
	}

}

let savedCanvas = [];
let removedCanvas = [];

const clear = document.querySelector("#clearimg");
const download = document.querySelector("#downloadimg");

const redo = document.querySelector("#redo");
const redoLimit = 30;
redo.addEventListener('click', redoAction);

let undoClicks = 0;
const undo = document.querySelector("#undo");
const undoLimit = 5;
undo.addEventListener('click', undoAction);


download.addEventListener("click", function() {
    url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    // NOTE: The method used before only worked in Firefox. 
    // This method is compatible with Chrome.
    var link = document.createElement('a');
    link.download = "drawing.png";
    link.href = url;
    link.click();
});

clear.addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function changeArrow(arrow, opacity, cursor) {
	arrow.querySelector("path").style.fill = 'rgba(255, 255, 255, ' + opacity + ')';
	arrow.style.cursor = cursor;
}

function undoAction() {

    if (undoClicks <= undoLimit && savedCanvas.length > 0) {
		undoClicks++;
		removedCanvas.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
		
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(savedCanvas.pop(), 0, 0);
		
		if (undoClicks == undoLimit || savedCanvas.length == 0) {
			console.log("uh oh");
			changeArrow(undo, '0.5', 'default');
			savedCanvas = [];
			undoClicks = 0;
		
		} 
    } 
	
	console.log("removedCanvas list: " + removedCanvas.length);
    console.log("savedCanvas list: " + savedCanvas.length);
}

function redoAction() {

    if (savedCanvas.length <= redoLimit) {
        savedCanvas.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(removedCanvas.pop(), 0, 0);

        if (savedCanvas.length == redoLimit) {
            redo.querySelector("path").style.fill = 'rgba(255, 255, 255, 0.5)';
            redo.style.cursor = 'default';
        }

    } 
    
	console.log("removedCanvas list: " + removedCanvas.length);
    console.log("savedCanvas list: " + savedCanvas.length);

}