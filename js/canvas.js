const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    false,
    "url('public/paintbrush.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "source-over",
    5
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "url('public/eraser.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "destination-out",
    16
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
}, false);

PaintBrush.elmt.addEventListener('click', function () {
    PaintBrush.enable();
}, false);

FillTool.elmt.addEventListener('click', function () {
    FillTool.enable();
}, false);

function disableAll() {
	PaintBrush.disable();
	EraserBrush.disable();
    FillTool.disable();
}

function chooseColor() {
    colorPicker.addEventListener("click", function() {
        colorClicked = true;

        colorPicker.addEventListener('change', function() {

            if (PaintBrush.selected) {
                PaintBrush.color = colorPicker.value;
                PaintBrush.setColor();
            }

            if (FillTool.selected) {
                FillTool.color = colorPicker.value;
                FillTool.setColor();
            }

        });
    });

    for (var i = 0; i < palette.length; i++) {
        palette[i].addEventListener('click', function(){
            colorClicked = true;

            if (PaintBrush.selected) {
                PaintBrush.color = this.style.backgroundColor;
                PaintBrush.setColor();
            }

            if (FillTool.selected) {
                FillTool.color = this.style.backgroundColor;
                FillTool.setColor();
            }

        });
    }

    if (!colorClicked) {

        if (PaintBrush.selected) {
            PaintBrush.color = 'rgb(255, 255, 255)';
            PaintBrush.setColor();
        }

        if (FillTool.selected) {
            FillTool.color = 'rgb(255, 255, 255)';
            FillTool.setColor();
        }
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