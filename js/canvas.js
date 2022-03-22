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
	
	colorPicker.addEventListener('change', function() {
		colorClicked = true;
		console.log("color picker changed: " + colorPicker.value);
		setToolColor(colorPicker.value);
	});

	palette.forEach(function(color){
		color.addEventListener("click", function() {
			colorClicked = true;
			setToolColor(color.style.backgroundColor);
		});
	});
}


function setToolColor(value) {
	
	/*if (colorPicker.value == null || colorPicker.value == '') {
		console.log(colorPicker.select());
		colorPicker.value = colorPicker.select();
	}*/
		
    if (PaintBrush.selected) {
        PaintBrush.setColor(value);
	}

    if (FillTool.selected)  {
        FillTool.setColor(value);
	}
	
	if (colorClicked && EraserBrush.selected) {
		disableAll();
		PaintBrush.enable();
		PaintBrush.setColor(colorPicker.value);
	}

}

let savedCanvas = [];
let removedCanvas = [];

const clear = document.querySelector("#clearimg");
const download = document.querySelector("#downloadimg");
const redo = document.querySelector("#redo");
redo.addEventListener('click', redoAction);

const undo = document.querySelector("#undo");
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

function undoAction() {
    removedCanvas.push(canvas.toDataURL("image/png"));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let undoImage = new Image();

    undoImage.onload = function() {
        ctx.drawImage(undoImage, 0, 0);
    }

    undoImage.src = savedCanvas.pop();
}

function redoAction() {
    savedCanvas.push(canvas.toDataURL("image/png"));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let redoImage = new Image();

    redoImage.onload = function() {
        ctx.drawImage(redoImage, 0, 0);
    }

    redoImage.src = removedCanvas.pop();
}