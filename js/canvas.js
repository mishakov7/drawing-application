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