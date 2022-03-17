const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    false,
    "url('paintbrush.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "source-over",
    5
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "url('eraser.svg'), auto",
    "rgb(255, 255, 255)",
    false,
    "destination-out",
    16
);


PaintBrush.enable();
PaintBrush.addCanvasStroke();
chooseColor();

EraserBrush.elmt.addEventListener('click', function () {
    EraserBrush.enable();
}, false);

PaintBrush.elmt.addEventListener('click', function () {
    PaintBrush.enable();
}, false);

function disableAll() {
	PaintBrush.disable();
	EraserBrush.disable();
}

function chooseColor() {
    colorPicker.addEventListener("click", function() {
        colorClicked = true;

        colorPicker.addEventListener('change', function() {
            PaintBrush.color = colorPicker.value;
            PaintBrush.setColor();
        });
    });

    for (var i = 0; i < palette.length; i++) {
        palette[i].addEventListener('click', function(){
            colorClicked = true;
            PaintBrush.color = this.style.backgroundColor;
            PaintBrush.setColor();

        });
    }

    if (!colorClicked) {
        PaintBrush.color = 'rgb(255, 255, 255)';
        PaintBrush.setColor();
    }

    // PaintBrush.setColor();

}