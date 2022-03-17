const PaintBrush = new Brush(
    document.querySelector("#brushtool"),
    false,
    "url('paintbrush.svg'), auto",
    false,
    "source-over",
    5,
    "rgb(255, 255, 255)"
);

const EraserBrush = new Brush(
    document.querySelector("#erasetool"),
    false,
    "url('eraser.svg'), auto",
    false,
    "destination-out",
    16
);


PaintBrush.enable();
PaintBrush.addCanvasStroke();


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